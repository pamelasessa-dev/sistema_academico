import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoPeriodo } from '../generated/prisma/enums.js';
import { CreatePeriodoDto } from './dto/create-periodo.dto.js';
import { UpdatePeriodoDto } from './dto/update-periodo.dto.js';

@Injectable()
export class PeriodosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.periodo.findMany({
      orderBy: {
        id_periodo: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const periodo = await this.prisma.periodo.findUnique({
      where: {
        id_periodo: id,
      },
    });

    if (!periodo) {
      throw new NotFoundException('Período no encontrado');
    }

    return periodo;
  }

  async create(dto: CreatePeriodoDto) {
    const fechaInicio = new Date(dto.fecha_inicio);
    const fechaFin = new Date(dto.fecha_fin);

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException(
        'La fecha de finalización debe ser posterior a la fecha de inicio',
      );
    }

    return this.prisma.periodo.create({
      data: {
        nombre: dto.nombre,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        limite_creditos: dto.limite_creditos,
        estado:
          dto.estado ?? EstadoPeriodo.PLANIFICADO,
      },
    });
  }

  async update(id: number, dto: UpdatePeriodoDto) {
    const periodoActual = await this.findOne(id);

    const fechaInicio = dto.fecha_inicio
      ? new Date(dto.fecha_inicio)
      : periodoActual.fecha_inicio;

    const fechaFin = dto.fecha_fin
      ? new Date(dto.fecha_fin)
      : periodoActual.fecha_fin;

    if (fechaFin <= fechaInicio) {
      throw new BadRequestException(
        'La fecha de finalización debe ser posterior a la fecha de inicio',
      );
    }

    if (
      dto.estado === EstadoPeriodo.ACTIVO &&
      periodoActual.estado !== EstadoPeriodo.ACTIVO
    ) {
      const periodoActivo =
        await this.prisma.periodo.findFirst({
          where: {
            estado: EstadoPeriodo.ACTIVO,
            id_periodo: {
              not: id,
            },
          },
        });

      if (periodoActivo) {
        throw new ConflictException(
          'Ya existe otro período activo',
        );
      }
    }

    return this.prisma.periodo.update({
      where: {
        id_periodo: id,
      },
      data: {
        ...(dto.nombre !== undefined && {
          nombre: dto.nombre,
        }),
        ...(dto.fecha_inicio !== undefined && {
          fecha_inicio: fechaInicio,
        }),
        ...(dto.fecha_fin !== undefined && {
          fecha_fin: fechaFin,
        }),
        ...(dto.limite_creditos !== undefined && {
          limite_creditos: dto.limite_creditos,
        }),
        ...(dto.estado !== undefined && {
          estado: dto.estado,
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const grupos = await this.prisma.grupo.count({
      where: {
        id_periodo: id,
      },
    });

    if (grupos > 0) {
      throw new ConflictException(
        'No se puede eliminar el período porque tiene grupos asociados',
      );
    }

    await this.prisma.periodo.delete({
      where: {
        id_periodo: id,
      },
    });

    return {
      message: 'Período eliminado correctamente',
    };
  }
}