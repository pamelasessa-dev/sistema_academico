import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  EstadoObligacion,
  EstadoUsuario,
} from '../generated/prisma/enums.js';

import { PrismaService } from '../prisma/prisma.service.js';

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
    return this.prisma.$transaction(async (tx) => {
      const ahora = new Date();

      const obligacionesVencidas =
        await tx.obligacionFinanciera.findMany({
          where: {
            estado: EstadoObligacion.PENDIENTE,
            fecha_vencimiento: {
              lt: ahora,
            },
          },
          select: {
            id_estudiante: true,
          },
        });

      if (obligacionesVencidas.length === 0) {
        return {
          obligacionesVencidas: 0,
          estudiantesSuspendidos: 0,
        };
      }

      await tx.obligacionFinanciera.updateMany({
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

      const idsEstudiantes = [
        ...new Set(
          obligacionesVencidas.map(
            (obligacion) => obligacion.id_estudiante,
          ),
        ),
      ];

      const estudiantes =
        await tx.estudiante.findMany({
          where: {
            id_estudiante: {
              in: idsEstudiantes,
            },
          },
          select: {
            id_usuario: true,
          },
        });

      const idsUsuarios = estudiantes.map(
        (estudiante) => estudiante.id_usuario,
      );

      if (idsUsuarios.length === 0) {
        return {
          obligacionesVencidas: obligacionesVencidas.length,
          estudiantesSuspendidos: 0,
        };
      }

      const resultado =
        await tx.usuario.updateMany({
          where: {
            id_usuario: {
              in: idsUsuarios,
            },
            estado: EstadoUsuario.ACTIVO,
          },
          data: {
            estado: EstadoUsuario.SUSPENDIDO,
          },
        });

      return {
        obligacionesVencidas: obligacionesVencidas.length,
        estudiantesSuspendidos: resultado.count,
      };
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