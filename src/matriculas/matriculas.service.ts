import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  ConceptoObligacion,
  EstadoGrupo,
  EstadoMateria,
  EstadoMatricula,
  EstadoObligacion,
  EstadoPeriodo,
  EstadoUsuario,
} from '../generated/prisma/enums.js';
import { CreateMatriculaDto } from './dto/create-matricula.dto.js';

@Injectable()
export class MatriculasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(idUsuario: number, dto: CreateMatriculaDto) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        id_usuario: idUsuario,
      },
      include: {
        usuario: true,
      },
    });

    if (!estudiante) {
      throw new NotFoundException(
        'No existe un estudiante asociado al usuario autenticado',
      );
    }

    if (estudiante.usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new ForbiddenException(
        'El usuario no está activo para realizar matrículas',
      );
    }

    const grupo = await this.prisma.grupo.findUnique({
      where: {
        id_grupo: dto.id_grupo,
      },
      include: {
        materia: true,
        periodo: true,
        horarios: true,
      },
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    if (grupo.estado !== EstadoGrupo.ABIERTO) {
      throw new BadRequestException(
        'El grupo no está abierto para nuevas matrículas',
      );
    }

    if (grupo.periodo.estado !== EstadoPeriodo.ACTIVO) {
      throw new BadRequestException(
        'El período del grupo no está activo',
      );
    }

    if (grupo.materia.estado !== EstadoMateria.ACTIVA) {
      throw new BadRequestException(
        'La materia no está activa para nuevas matrículas',
      );
    }

    const cantidadMatriculas = await this.prisma.matricula.count({
      where: {
        id_grupo: dto.id_grupo,
        estado: {
          in: [
            EstadoMatricula.PENDIENTE,
            EstadoMatricula.ACTIVA,
          ],
        },
      },
    });

    if (cantidadMatriculas >= grupo.cupo_maximo) {
      throw new BadRequestException(
        'El grupo no tiene cupos disponibles',
      );
    }

    const matriculaExistente =
      await this.prisma.matricula.findUnique({
        where: {
          id_estudiante_id_grupo: {
            id_estudiante: estudiante.id_estudiante,
            id_grupo: dto.id_grupo,
          },
        },
      });

    if (matriculaExistente) {
      throw new BadRequestException(
        'El estudiante ya está matriculado en este grupo',
      );
    }

    const mismaMateria = await this.prisma.matricula.findFirst({
      where: {
        id_estudiante: estudiante.id_estudiante,
        estado: {
          in: [
            EstadoMatricula.PENDIENTE,
            EstadoMatricula.ACTIVA,
          ],
        },
        grupo: {
          id_materia: grupo.id_materia,
          id_periodo: grupo.id_periodo,
        },
      },
    });

    if (mismaMateria) {
      throw new BadRequestException(
        'El estudiante ya está matriculado en esta materia durante el período actual',
      );
    }

    const matriculasPeriodo = await this.prisma.matricula.findMany({
      where: {
        id_estudiante: estudiante.id_estudiante,
        estado: {
          in: [
            EstadoMatricula.PENDIENTE,
            EstadoMatricula.ACTIVA,
          ],
        },
        grupo: {
          id_periodo: grupo.id_periodo,
        },
      },
      include: {
        grupo: {
          include: {
            materia: true,
          },
        },
      },
    });

    const creditosActuales = matriculasPeriodo.reduce(
      (total, matricula) =>
        total + matricula.grupo.materia.creditos,
      0,
    );

    const creditosTotales =
      creditosActuales + grupo.materia.creditos;

    if (creditosTotales > grupo.periodo.limite_creditos) {
      throw new BadRequestException(
        'La matrícula supera el límite de créditos permitido en este período',
      );
    }

    const matriculasConHorarios =
      await this.prisma.matricula.findMany({
        where: {
          id_estudiante: estudiante.id_estudiante,
          estado: {
            in: [
              EstadoMatricula.PENDIENTE,
              EstadoMatricula.ACTIVA,
            ],
          },
          grupo: {
            id_periodo: grupo.id_periodo,
          },
        },
        include: {
          grupo: {
            include: {
              horarios: true,
            },
          },
        },
      });

    for (const matricula of matriculasConHorarios) {
      for (const horarioExistente of matricula.grupo.horarios) {
        for (const horarioNuevo of grupo.horarios) {
          if (
            horarioExistente.dia_semana !==
            horarioNuevo.dia_semana
          ) {
            continue;
          }

          const seSuperponen =
            horarioNuevo.hora_inicio <
              horarioExistente.hora_fin &&
            horarioNuevo.hora_fin >
              horarioExistente.hora_inicio;

          if (seSuperponen) {
            throw new BadRequestException(
              'El horario del nuevo grupo se superpone con una materia a la que ya está matriculado',
            );
          }
        }
      }
    }

    const obligacionVencida =
      await this.prisma.obligacionFinanciera.findFirst({
        where: {
          id_estudiante: estudiante.id_estudiante,
          estado: EstadoObligacion.VENCIDA,
        },
      });

    if (obligacionVencida) {
      throw new BadRequestException(
        'El estudiante tiene una obligación financiera vencida',
      );
    }

    const ahora = new Date();

    const fechaVencimiento = new Date(
      ahora.getTime() + 48 * 60 * 60 * 1000,
    );

    const resultado = await this.prisma.$transaction(
      async (tx) => {
        const matricula = await tx.matricula.create({
          data: {
            id_estudiante: estudiante.id_estudiante,
            id_grupo: grupo.id_grupo,
            fecha_matricula: ahora,
            estado: EstadoMatricula.PENDIENTE,
          },
        });

        const obligacion =
          await tx.obligacionFinanciera.create({
            data: {
              id_estudiante: estudiante.id_estudiante,
              id_matricula: matricula.id_matricula,
              concepto: ConceptoObligacion.INSCRIPCION,
              monto: grupo.materia.costos_inscripcion,
              fecha_emision: ahora,
              fecha_vencimiento: fechaVencimiento,
              estado: EstadoObligacion.PENDIENTE,
            },
          });

        return {
          matricula,
          obligacion,
        };
      },
    );

    return {
      mensaje:
        'Matrícula creada correctamente. Queda pendiente de pago y validación.',
      matricula: resultado.matricula,
      obligacion: resultado.obligacion,
    };
  }

  async findMyEnrollments(idUsuario: number) {
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        id_usuario: idUsuario,
      },
    });

    if (!estudiante) {
      throw new NotFoundException(
        'El usuario autenticado no está asociado a un estudiante',
      );
    }

    return this.prisma.matricula.findMany({
      where: {
        id_estudiante: estudiante.id_estudiante,
      },
      include: {
        grupo: {
          include: {
            materia: true,
            periodo: true,
            profesor: {
              include: {
                usuario: {
                  select: {
                    id_usuario: true,
                    primer_nombre: true,
                    segundo_nombre: true,
                    primer_apellido: true,
                    segundo_apellido: true,
                    email: true,
                  },
                },
              },
            },
            aula: true,
            horarios: true,
          },
        },
        obligaciones: {
          include: {
            pagos: true,
          },
        },
      },
      orderBy: {
        fecha_matricula: 'desc',
      },
    });
  }
}