import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  EstadoActividad,
  EstadoGrupo,
  EstadoMatricula,
  RolUsuario,
} from '../generated/prisma/enums.js';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateActividadDto } from './dto/create-actividad.dto.js';
import { UpdateActividadDto } from './dto/update-actividad.dto.js';
import { UpdateEstadoActividadDto } from './dto/update-estado-actividad.dto.js';

@Injectable()
export class ActividadesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea una actividad académica.
   * Solamente el profesor responsable del grupo puede crearla.
   * Toda actividad nueva comienza en estado BORRADOR.
   */
  async create(idUsuario: number, dto: CreateActividadDto) {
    const profesor = await this.prisma.profesor.findUnique({
      where: {
        id_usuario: idUsuario,
      },
    });

    if (!profesor) {
      throw new ForbiddenException('El usuario no está asociado a un profesor');
    }

    const grupo = await this.prisma.grupo.findUnique({
      where: {
        id_grupo: dto.id_grupo,
      },
      include: {
        periodo: true,
      },
    });

    if (!grupo) {
      throw new NotFoundException('El grupo no existe');
    }

    if (grupo.id_profesor !== profesor.id_profesor) {
      throw new ForbiddenException(
        'No puedes crear actividades para un grupo que no tienes asignado',
      );
    }

    if (grupo.estado !== EstadoGrupo.ABIERTO) {
      throw new BadRequestException(
        'No se pueden crear actividades en un grupo cerrado o finalizado',
      );
    }

    const fechaApertura = new Date(dto.fecha_apertura);
    const fechaCierre = new Date(dto.fecha_cierre);

    if (fechaApertura >= fechaCierre) {
      throw new BadRequestException(
        'La fecha de apertura debe ser anterior a la fecha de cierre',
      );
    }

    if (
      fechaApertura < grupo.periodo.fecha_inicio ||
      fechaCierre > grupo.periodo.fecha_fin
    ) {
      throw new BadRequestException(
        'Las fechas de la actividad deben estar dentro del período académico del grupo',
      );
    }

    return this.prisma.actividadAcademica.create({
      data: {
        id_grupo: dto.id_grupo,
        titulo: dto.titulo.trim(),
        descripcion: dto.descripcion?.trim(),
        tipo: dto.tipo,
        puntaje_maximo: dto.puntaje_maximo,
        porcentaje_aporte: dto.porcentaje_aporte,
        fecha_apertura: fechaApertura,
        fecha_cierre: fechaCierre,
        estado: EstadoActividad.BORRADOR,
      },
    });
  }

  /**
   * Consulta las actividades de un grupo.
   *
   * PROFESOR: solamente sus propios grupos y ve todos los estados.
   * ESTUDIANTE: necesita matrícula activa y no ve borradores.
   * RECEPCIONISTA: no ve borradores.
   * ADMIN: puede consultar todas las actividades.
   */
  async findByGroup(idUsuario: number, rol: RolUsuario, idGrupo: number) {
    const grupo = await this.prisma.grupo.findUnique({
      where: {
        id_grupo: idGrupo,
      },
    });

    if (!grupo) {
      throw new NotFoundException('El grupo no existe');
    }

    // Verificar que el profesor sea responsable del grupo.
    if (rol === RolUsuario.PROFESOR) {
      const profesor = await this.prisma.profesor.findUnique({
        where: {
          id_usuario: idUsuario,
        },
      });

      if (!profesor || profesor.id_profesor !== grupo.id_profesor) {
        throw new ForbiddenException(
          'No puedes consultar las actividades de este grupo',
        );
      }
    }

    // Verificar que el estudiante tenga matrícula activa.
    if (rol === RolUsuario.ESTUDIANTE) {
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

      const matricula = await this.prisma.matricula.findFirst({
        where: {
          id_estudiante: estudiante.id_estudiante,
          id_grupo: idGrupo,
          estado: EstadoMatricula.ACTIVA,
        },
      });

      if (!matricula) {
        throw new ForbiddenException(
          'No tienes una matrícula activa en este grupo',
        );
      }
    }

    // Estudiantes y recepcionistas solamente consultan actividades publicadas.
    const where =
      rol === RolUsuario.ESTUDIANTE || rol === RolUsuario.RECEPCIONISTA
        ? {
            id_grupo: idGrupo,
            estado: {
              in: [EstadoActividad.ABIERTA, EstadoActividad.CERRADA],
            },
          }
        : {
            id_grupo: idGrupo,
          };

    return this.prisma.actividadAcademica.findMany({
      where,
      orderBy: {
        fecha_apertura: 'asc',
      },
    });
  }

  /**
   * Consulta una actividad por su identificador.
   * Este método interno no aplica permisos por rol.
   * Los métodos públicos de consulta realizan esas verificaciones.
   */
  private async obtenerActividad(idActividad: number) {
    const actividad = await this.prisma.actividadAcademica.findUnique({
      where: {
        id_actividad: idActividad,
      },
      include: {
        grupo: {
          include: {
            materia: true,
            periodo: true,
          },
        },
      },
    });

    if (!actividad) {
      throw new NotFoundException('La actividad no existe');
    }

    return actividad;
  }

  /**
   * Consulta una actividad individual según el rol.
   */
  async findOne(idUsuario: number, rol: RolUsuario, idActividad: number) {
    const actividad = await this.obtenerActividad(idActividad);

    // El profesor solamente puede consultar actividades de sus grupos.
    if (rol === RolUsuario.PROFESOR) {
      const profesor = await this.prisma.profesor.findUnique({
        where: {
          id_usuario: idUsuario,
        },
      });

      if (!profesor || profesor.id_profesor !== actividad.grupo.id_profesor) {
        throw new ForbiddenException('No puedes consultar esta actividad');
      }
    }

    // El estudiante no puede consultar borradores ni actividades
    // de grupos donde no tenga matrícula activa.
    if (rol === RolUsuario.ESTUDIANTE) {
      if (actividad.estado === EstadoActividad.BORRADOR) {
        throw new ForbiddenException(
          'No tienes permiso para consultar esta actividad',
        );
      }

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

      const matricula = await this.prisma.matricula.findFirst({
        where: {
          id_estudiante: estudiante.id_estudiante,
          id_grupo: actividad.id_grupo,
          estado: EstadoMatricula.ACTIVA,
        },
      });

      if (!matricula) {
        throw new ForbiddenException(
          'No tienes una matrícula activa en el grupo de esta actividad',
        );
      }
    }

    // Recepción puede consultar actividades publicadas.
    if (
      rol === RolUsuario.RECEPCIONISTA &&
      actividad.estado === EstadoActividad.BORRADOR
    ) {
      throw new ForbiddenException(
        'No tienes permiso para consultar esta actividad',
      );
    }

    return actividad;
  }

  /**
   * Edita una actividad.
   * Solamente el profesor responsable puede modificar borradores.
   */
  async update(
    idUsuario: number,
    idActividad: number,
    dto: UpdateActividadDto,
  ) {
    const actividad = await this.obtenerActividad(idActividad);

    const profesor = await this.prisma.profesor.findUnique({
      where: {
        id_usuario: idUsuario,
      },
    });

    if (!profesor) {
      throw new ForbiddenException('El usuario no está asociado a un profesor');
    }

    if (actividad.grupo.id_profesor !== profesor.id_profesor) {
      throw new ForbiddenException('No puedes modificar esta actividad');
    }

    if (actividad.estado !== EstadoActividad.BORRADOR) {
      throw new BadRequestException(
        'Solo se pueden modificar actividades en estado BORRADOR',
      );
    }

    const fechaApertura = dto.fecha_apertura
      ? new Date(dto.fecha_apertura)
      : actividad.fecha_apertura;

    const fechaCierre = dto.fecha_cierre
      ? new Date(dto.fecha_cierre)
      : actividad.fecha_cierre;

    if (fechaApertura >= fechaCierre) {
      throw new BadRequestException(
        'La fecha de apertura debe ser anterior a la fecha de cierre',
      );
    }

    if (
      fechaApertura < actividad.grupo.periodo.fecha_inicio ||
      fechaCierre > actividad.grupo.periodo.fecha_fin
    ) {
      throw new BadRequestException(
        'Las fechas de la actividad deben estar dentro del período académico del grupo',
      );
    }

    return this.prisma.actividadAcademica.update({
      where: {
        id_actividad: idActividad,
      },
      data: {
        ...(dto.titulo !== undefined && {
          titulo: dto.titulo.trim(),
        }),
        ...(dto.descripcion !== undefined && {
          descripcion: dto.descripcion.trim(),
        }),
        ...(dto.tipo !== undefined && {
          tipo: dto.tipo,
        }),
        ...(dto.puntaje_maximo !== undefined && {
          puntaje_maximo: dto.puntaje_maximo,
        }),
        ...(dto.porcentaje_aporte !== undefined && {
          porcentaje_aporte: dto.porcentaje_aporte,
        }),
        ...(dto.fecha_apertura !== undefined && {
          fecha_apertura: fechaApertura,
        }),
        ...(dto.fecha_cierre !== undefined && {
          fecha_cierre: fechaCierre,
        }),
      },
    });
  }

  /**
   * Cambia el estado de una actividad.
   * Transiciones permitidas:
   * BORRADOR -> ABIERTA -> CERRADA.
   */
  async updateEstado(
    idUsuario: number,
    idActividad: number,
    dto: UpdateEstadoActividadDto,
  ) {
    const actividad = await this.obtenerActividad(idActividad);

    const profesor = await this.prisma.profesor.findUnique({
      where: {
        id_usuario: idUsuario,
      },
    });

    if (!profesor) {
      throw new ForbiddenException('El usuario no está asociado a un profesor');
    }

    if (actividad.grupo.id_profesor !== profesor.id_profesor) {
      throw new ForbiddenException('No puedes modificar esta actividad');
    }

    const transicionesPermitidas: Record<EstadoActividad, EstadoActividad[]> = {
      [EstadoActividad.BORRADOR]: [EstadoActividad.ABIERTA],
      [EstadoActividad.ABIERTA]: [EstadoActividad.CERRADA],
      [EstadoActividad.CERRADA]: [],
    };

    const estadosPermitidos = transicionesPermitidas[actividad.estado];

    if (!estadosPermitidos.includes(dto.estado)) {
      throw new BadRequestException(
        `No se puede cambiar de ${actividad.estado} a ${dto.estado}`,
      );
    }

    return this.prisma.actividadAcademica.update({
      where: {
        id_actividad: idActividad,
      },
      data: {
        estado: dto.estado,
      },
    });
  }
}
