import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  EstadoActividad,
  EstadoGrupo,
} from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateActividadDto } from './dto/create-actividad.dto.js';
import { UpdateActividadDto } from './dto/update-actividad.dto.js';
import { UpdateEstadoActividadDto } from './dto/update-estado-actividad.dto.js';

@Injectable()
export class ActividadesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(idUsuario: number, dto: CreateActividadDto) {
    const profesor = await this.prisma.profesor.findUnique({
      where: {
        id_usuario: idUsuario,
      },
    });

    if (!profesor) {
      throw new ForbiddenException(
        'El usuario no está asociado a un profesor',
      );
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
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        tipo: dto.tipo,
        puntaje_maximo: dto.puntaje_maximo,
        porcentaje_aporte: dto.porcentaje_aporte,
        fecha_apertura: fechaApertura,
        fecha_cierre: fechaCierre,
        estado: EstadoActividad.BORRADOR,
      },
    });
  }

  async findByGroup(idGrupo: number) {
    const grupo = await this.prisma.grupo.findUnique({
      where: {
        id_grupo: idGrupo,
      },
    });

    if (!grupo) {
      throw new NotFoundException('El grupo no existe');
    }

    return this.prisma.actividadAcademica.findMany({
      where: {
        id_grupo: idGrupo,
      },
      orderBy: {
        fecha_apertura: 'asc',
      },
    });
  }

  async findOne(idActividad: number) {
    const actividad =
      await this.prisma.actividadAcademica.findUnique({
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

  async update(
    idUsuario: number,
    idActividad: number,
    dto: UpdateActividadDto,
  ) {
    const actividad = await this.findOne(idActividad);

    const profesor = await this.prisma.profesor.findUnique({
      where: {
        id_usuario: idUsuario,
      },
    });

    if (!profesor) {
      throw new ForbiddenException(
        'El usuario no está asociado a un profesor',
      );
    }

    if (actividad.grupo.id_profesor !== profesor.id_profesor) {
      throw new ForbiddenException(
        'No puedes modificar esta actividad',
      );
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
          titulo: dto.titulo,
        }),
        ...(dto.descripcion !== undefined && {
          descripcion: dto.descripcion,
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

  async updateEstado(
    idUsuario: number,
    idActividad: number,
    dto: UpdateEstadoActividadDto,
  ) {
    const actividad = await this.findOne(idActividad);

    const profesor = await this.prisma.profesor.findUnique({
      where: {
        id_usuario: idUsuario,
      },
    });

    if (!profesor) {
      throw new ForbiddenException(
        'El usuario no está asociado a un profesor',
      );
    }

    if (actividad.grupo.id_profesor !== profesor.id_profesor) {
      throw new ForbiddenException(
        'No puedes modificar esta actividad',
      );
    }

    const transicionesPermitidas: Record<
      EstadoActividad,
      EstadoActividad[]
    > = {
      [EstadoActividad.BORRADOR]: [EstadoActividad.ABIERTA],
      [EstadoActividad.ABIERTA]: [EstadoActividad.CERRADA],
      [EstadoActividad.CERRADA]: [],
    };

    const estadosPermitidos =
      transicionesPermitidas[actividad.estado];

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