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
    // Buscar el estudiante a partir del usuario autenticado.
    const estudiante = await this.prisma.estudiante.findUnique({
      where: {
        id_usuario: idUsuario,
      },
      include: {
        usuario: true,
      },
    });

    // El usuario autenticado debe tener un registro de estudiante.
    if (!estudiante) {
      throw new NotFoundException(
        'No existe un estudiante asociado al usuario autenticado',
      );
    }

    // El usuario debe estar ACTIVO.
    if (estudiante.usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new ForbiddenException(
        'El usuario no está activo para realizar matrículas',
      );
    }

    // Buscar el grupo y traer la información necesaria.
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

    // El grupo debe existir.
    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    // El grupo debe estar ABIERTO.
    if (grupo.estado !== EstadoGrupo.ABIERTO) {
      throw new BadRequestException(
        'El grupo no está abierto para nuevas matrículas',
      );
    }

    // El período debe estar ACTIVO.
    if (grupo.periodo.estado !== EstadoPeriodo.ACTIVO) {
      throw new BadRequestException(
        'El período del grupo no está activo',
      );
    }

    // La materia debe estar ACTIVA.
    if (grupo.materia.estado !== EstadoMateria.ACTIVA) {
      throw new BadRequestException(
        'La materia no está activa para nuevas matrículas',
      );
    }

    // Contar cuántos estudiantes tienen una matrícula
    // PENDIENTE o ACTIVA en este grupo.
    const cantidadMatriculas = await this.prisma.matricula.count({
      where: {
        id_grupo: dto.id_grupo,
        estado: {
          in: [EstadoMatricula.PENDIENTE, EstadoMatricula.ACTIVA],
        },
      },
    });

    // Si la cantidad actual alcanzó el cupo máximo,
    // no se permite una nueva matrícula.
    if (cantidadMatriculas >= grupo.cupo_maximo) {
      throw new BadRequestException(
        'El grupo no tiene cupos disponibles',
      );
    }

    // Comprobar si el estudiante ya tiene una matrícula
    // para este mismo grupo.
    const matriculaExistente = await this.prisma.matricula.findFirst({
      where: {
        id_estudiante: estudiante.id_estudiante,
        id_grupo: dto.id_grupo,
      },
    });

    // Si existe una matrícula, no permitimos otra.
    if (matriculaExistente) {
      throw new BadRequestException(
        'El estudiante ya está matriculado en este grupo',
      );
    }

    // Comprobar si el estudiante ya está matriculado
    // en la misma materia durante este período.
    const mismaMateria = await this.prisma.matricula.findFirst({
      where: {
        id_estudiante: estudiante.id_estudiante,
        estado: {
          in: [EstadoMatricula.PENDIENTE, EstadoMatricula.ACTIVA],
        },
        grupo: {
          id_materia: grupo.id_materia,
          id_periodo: grupo.id_periodo,
        },
      },
    });

    // Si ya existe una matrícula para esa materia,
    // no puede matricularse en otro grupo de la misma materia.
    if (mismaMateria) {
      throw new BadRequestException(
        'El estudiante ya está matriculado en esta materia durante el período actual',
      );
    }

    // Buscar todas las matrículas PENDIENTES o ACTIVAS
    // que el estudiante tiene en este período.
    const matriculasPeriodo = await this.prisma.matricula.findMany({
      where: {
        id_estudiante: estudiante.id_estudiante,
        estado: {
          in: [EstadoMatricula.PENDIENTE, EstadoMatricula.ACTIVA],
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

    // Calcular cuántos créditos tiene actualmente
    // el estudiante en este período.
    const creditosActuales = matriculasPeriodo.reduce(
      (total, matricula) => total + matricula.grupo.materia.creditos,
      0,
    );

    // Sumar los créditos actuales con los créditos
    // de la nueva materia.
    const creditosTotales =
      creditosActuales + grupo.materia.creditos;

    // Si supera el límite de créditos del período,
    // no se permite la matrícula.
    if (creditosTotales > grupo.periodo.limite_creditos) {
      throw new BadRequestException(
        'La matrícula supera el límite de créditos permitido en este período',
      );
    }

    // Traer las matrículas que ya tiene el estudiante
    // junto con los horarios de sus grupos.
    const matriculasConHorarios =
      await this.prisma.matricula.findMany({
        where: {
          id_estudiante: estudiante.id_estudiante,
          estado: {
            in: [EstadoMatricula.PENDIENTE, EstadoMatricula.ACTIVA],
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

    // Recorrer cada matrícula que el estudiante ya tiene.
    for (const matricula of matriculasConHorarios) {
      // "matricula" representa una materia/grupo
      // que el estudiante ya tiene.

      // Recorrer cada horario de esa matrícula.
      for (const horarioExistente of matricula.grupo.horarios) {
        // "horarioExistente" representa UN horario
        // de una materia que el estudiante ya cursa.

        // Recorrer cada horario del NUEVO grupo.
        for (const horarioNuevo of grupo.horarios) {
          // "horarioNuevo" representa UN horario
          // de la nueva materia.

          // Primero comprobamos si los dos horarios
          // ocurren el mismo día.
          if (
            horarioExistente.dia_semana !==
            horarioNuevo.dia_semana
          ) {
            // Si son días diferentes, no pueden superponerse.
            // "continue" salta esta comparación y continúa
            // con el siguiente horario.
            continue;
          }

          // Comprobar si las horas de los dos horarios
          // se superponen.
          const seSuperponen =
            horarioNuevo.hora_inicio <
              horarioExistente.hora_fin &&
            horarioNuevo.hora_fin >
              horarioExistente.hora_inicio;

          // Si los horarios se superponen,
          // no permitimos la nueva matrícula.
          if (seSuperponen) {
            throw new BadRequestException(
              'El horario del nuevo grupo se superpone con una materia a la que ya está matriculado',
            );
          }
        }
      }
    }

    // Comprobar si el estudiante tiene alguna obligación vencida.
    const obligacionVencida =
      await this.prisma.obligacionFinanciera.findFirst({
        where: {
          id_estudiante: estudiante.id_estudiante,
          estado: EstadoObligacion.VENCIDA,
        },
      });

    // Si existe una obligación vencida,
    // no puede realizar una nueva matrícula.
    if (obligacionVencida) {
      throw new BadRequestException(
        'El estudiante tiene una obligación financiera vencida',
      );
    }

    // Obtener la fecha y hora actual.
    const ahora = new Date();

    // La obligación de inscripción vence exactamente
    // 48 horas después de crear la matrícula.
    const fechaVencimiento = new Date(
      ahora.getTime() + 48 * 60 * 60 * 1000,
      // 48 horas × 60 minutos × 60 segundos × 1000 milisegundos.
    );

    // Crear la matrícula y su obligación dentro
    // de una misma transacción.
    const resultado = await this.prisma.$transaction(async (tx) => {
      // Crear la matrícula en estado PENDIENTE.
      const matricula = await tx.matricula.create({
        data: {
          id_estudiante: estudiante.id_estudiante,
          id_grupo: grupo.id_grupo,
          fecha_matricula: ahora,
          estado: EstadoMatricula.PENDIENTE,
        },
      });

      // Crear la obligación financiera correspondiente
      // a la inscripción.
      const obligacion = await tx.obligacionFinanciera.create({
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

      // Devolver ambas cosas.
      return {
        matricula,
        obligacion,
      };
    });

    // Respuesta final.
    return {
      mensaje:
        'Matrícula creada correctamente. Queda pendiente de pago y validación.',
      matricula: resultado.matricula,
      obligacion: resultado.obligacion,
    };
  }
  // Obtener todas las matrículas del estudiante autenticado.
async findMyEnrollments(idUsuario: number) {
  // Buscamos al estudiante asociado al usuario del JWT.
  const estudiante = await this.prisma.estudiante.findUnique({
    where: {
      id_usuario: idUsuario,
    },
  });

  // Si el usuario autenticado no está asociado a un estudiante,
  // no puede consultar matrículas.
  if (!estudiante) {
    throw new NotFoundException(
      'El usuario autenticado no está asociado a un estudiante',
    );
  }

  // Buscamos todas las matrículas de ese estudiante.
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
              usuario: true,
            },
          },
          aula: true,
          horarios: true,
        },
      },
      obligaciones: true,
    },
    orderBy: {
      fecha_matricula: 'desc',
    },
  });
}
}