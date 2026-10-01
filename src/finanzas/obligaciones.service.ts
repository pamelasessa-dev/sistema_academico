import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoObligacion } from '../generated/prisma/enums.js';

@Injectable()
export class ObligacionesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMy(idUsuario: number) {
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

    await this.actualizarMora();

    return this.prisma.obligacionFinanciera.findMany({
      where: {
        id_estudiante: estudiante.id_estudiante,
      },
      include: {
        matricula: {
          include: {
            grupo: {
              include: {
                materia: true,
                periodo: true,
              },
            },
          },
        },
        pagos: true,
      },
      orderBy: {
        fecha_vencimiento: 'asc',
      },
    });
  }

  async findOne(idObligacion: number) {
    await this.actualizarMora();

    const obligacion =
      await this.prisma.obligacionFinanciera.findUnique({
        where: {
          id_obligacion: idObligacion,
        },
        include: {
          estudiante: {
            include: {
              usuario: {
                select: {
                  id_usuario: true,
                  primer_nombre: true,
                  primer_apellido: true,
                  email: true,
                },
              },
            },
          },
          matricula: {
            include: {
              grupo: {
                include: {
                  materia: true,
                  periodo: true,
                },
              },
            },
          },
          pagos: true,
        },
      });

    if (!obligacion) {
      throw new NotFoundException(
        'La obligación financiera no existe',
      );
    }

    return obligacion;
  }

  async actualizarMora() {
    const ahora = new Date();

    return this.prisma.obligacionFinanciera.updateMany({
      where: {
        estado: EstadoObligacion.PENDIENTE,
        fecha_vencimiento: {
          lt: ahora,
        },
      },
      data: {
        estado: EstadoObligacion.VENCIDA,
      },
    });
  }

  async tieneMora(idEstudiante: number): Promise<boolean> {
    await this.actualizarMora();

    const obligacion =
      await this.prisma.obligacionFinanciera.findFirst({
        where: {
          id_estudiante: idEstudiante,
          estado: EstadoObligacion.VENCIDA,
        },
      });

    return !!obligacion;
  }
}