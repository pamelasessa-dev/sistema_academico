import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  EstadoObligacion,
  EstadoPago,
} from '../generated/prisma/enums.js';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { RechazarPagoDto } from './dto/rechazar-pago.dto.js';

@Injectable()
export class PagosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(idUsuario: number, dto: CreatePagoDto) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        id_usuario: idUsuario,
      },
    });

    if (!estudiante) {
      throw new ForbiddenException(
        'El usuario no está asociado a un estudiante',
      );
    }

    const obligacion =
      await this.prisma.obligacionFinanciera.findUnique({
        where: {
          id_obligacion: dto.id_obligacion,
        },
      });

    if (!obligacion) {
      throw new NotFoundException(
        'La obligación financiera no existe',
      );
    }

    if (obligacion.id_estudiante !== estudiante.id_estudiante) {
      throw new ForbiddenException(
        'No puedes registrar un pago para una obligación que no te pertenece',
      );
    }

    if (
      obligacion.estado === EstadoObligacion.PAGADA ||
      obligacion.estado === EstadoObligacion.CANCELADA
    ) {
      throw new BadRequestException(
        'La obligación ya está pagada o cancelada',
      );
    }

    if (obligacion.estado === EstadoObligacion.VENCIDA) {
      throw new BadRequestException(
        'No se puede registrar un pago sobre una obligación vencida',
      );
    }

    if (dto.monto > Number(obligacion.monto)) {
      throw new BadRequestException(
        'El monto del pago no puede superar el monto de la obligación',
      );
    }

    const pagosPendientes =
      await this.prisma.pago.aggregate({
        where: {
          id_obligacion: dto.id_obligacion,
          estado: {
            in: [
              EstadoPago.PENDIENTE,
              EstadoPago.APROBADO,
            ],
          },
        },
        _sum: {
          monto: true,
        },
      });

    const totalComprometido = Number(
      pagosPendientes._sum.monto ?? 0,
    );

    if (
      totalComprometido + dto.monto >
      Number(obligacion.monto)
    ) {
      throw new BadRequestException(
        'El monto del pago supera el saldo pendiente de la obligación',
      );
    }

    return this.prisma.pago.create({
      data: {
        id_obligacion: dto.id_obligacion,
        monto: dto.monto,
        fecha_pago: new Date(),
        metodo: dto.metodo,
        estado: EstadoPago.PENDIENTE,
      },
    });
  }

  async aprobar(idUsuario: number, idPago: number) {
    const pago = await this.prisma.pago.findUnique({
      where: {
        id_pago: idPago,
      },
      include: {
        obligacion: true,
      },
    });

    if (!pago) {
      throw new NotFoundException('El pago no existe');
    }

    if (pago.estado !== EstadoPago.PENDIENTE) {
      throw new BadRequestException(
        'El pago ya fue procesado',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const pagoActualizado = await tx.pago.update({
        where: {
          id_pago: idPago,
        },
        data: {
          estado: EstadoPago.APROBADO,
          fecha_validacion: new Date(),
          id_usuario_verificador: idUsuario,
        },
      });

      const pagosAprobados = await tx.pago.aggregate({
        where: {
          id_obligacion: pago.id_obligacion,
          estado: EstadoPago.APROBADO,
        },
        _sum: {
          monto: true,
        },
      });

      const totalPagado = Number(
        pagosAprobados._sum.monto ?? 0,
      );

      if (
        totalPagado >= Number(pago.obligacion.monto)
      ) {
        await tx.obligacionFinanciera.update({
          where: {
            id_obligacion: pago.id_obligacion,
          },
          data: {
            estado: EstadoObligacion.PAGADA,
          },
        });
      }

      return pagoActualizado;
    });
  }

  async rechazar(
    idUsuario: number,
    idPago: number,
    dto: RechazarPagoDto,
  ) {
    const pago = await this.prisma.pago.findUnique({
      where: {
        id_pago: idPago,
      },
    });

    if (!pago) {
      throw new NotFoundException('El pago no existe');
    }

    if (pago.estado !== EstadoPago.PENDIENTE) {
      throw new BadRequestException(
        'El pago ya fue procesado',
      );
    }

    return this.prisma.pago.update({
      where: {
        id_pago: idPago,
      },
      data: {
        estado: EstadoPago.RECHAZADO,
        fecha_validacion: new Date(),
        id_usuario_verificador: idUsuario,
        observacion: dto.observacion,
      },
    });
  }
}