import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoActividad,
  EstadoEntrega,
  EstadoMatricula,
  EstadoObligacion,
} from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CalificarEntregaDto } from './dto/calificar-entrega.dto.js';
import { CreateEntregaDto } from './dto/create-entrega.dto.js';

@Injectable()
export class EntregasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(idUsuario: number, dto: CreateEntregaDto) {
    const archivoUrl = dto.archivo_url?.trim();
    const respuestaTexto = dto.respuesta_texto?.trim();

    if (!archivoUrl && !respuestaTexto) {
      throw new BadRequestException(
        'Debes proporcionar un archivo o una respuesta de texto',
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

    const actividad =
      await this.prisma.actividadAcademica.findUnique({
        where: {
          id_actividad: dto.id_actividad,
        },
        include: {
          grupo: true,
        },
      });

    if (!actividad) {
      throw new NotFoundException('La actividad no existe');
    }

    if (actividad.estado !== EstadoActividad.ABIERTA) {
      throw new BadRequestException(
        'La actividad no está abierta',
      );
    }

    const ahora = new Date();

    if (ahora < actividad.fecha_apertura) {
      throw new BadRequestException(
        'La actividad todavía no está disponible',
      );
    }

    if (ahora > actividad.fecha_cierre) {
      throw new BadRequestException(
        'El plazo de entrega ya finalizó',
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
        'No estás matriculado activamente en el grupo de esta actividad',
      );
    }

    const obligacionVencida =
      await this.prisma.obligacionFinanciera.findFirst({
        where: {
          id_estudiante: estudiante.id_estudiante,
          estado: EstadoObligacion.VENCIDA,
        },
      });

    if (obligacionVencida) {
      throw new ForbiddenException(
        'No puedes entregar actividades porque tienes obligaciones financieras vencidas',
      );
    }

    const entregaExistente =
      await this.prisma.entrega.findUnique({
        where: {
          id_actividad_id_matricula: {
            id_actividad: dto.id_actividad,
            id_matricula: matricula.id_matricula,
          },
        },
      });

    if (entregaExistente) {
      throw new BadRequestException(
        'Ya existe una entrega para esta actividad',
      );
    }

    return this.prisma.entrega.create({
      data: {
        id_actividad: dto.id_actividad,
        id_matricula: matricula.id_matricula,
        fecha_entrega: ahora,
        archivo_url: archivoUrl,
        respuesta_texto: respuestaTexto,
        estado: EstadoEntrega.ENTREGADA,
      },
    });
  }

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

    return this.prisma.entrega.findMany({
      where: {
        matricula: {
          id_estudiante: estudiante.id_estudiante,
        },
      },
      include: {
        actividad: {
          include: {
            grupo: {
              include: {
                materia: true,
              },
            },
          },
        },
      },
      orderBy: {
        fecha_entrega: 'desc',
      },
    });
  }

  async findByActivity(
    idUsuario: number,
    idActividad: number,
  ) {
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

    const actividad =
      await this.prisma.actividadAcademica.findUnique({
        where: {
          id_actividad: idActividad,
        },
        include: {
          grupo: true,
        },
      });

    if (!actividad) {
      throw new NotFoundException('La actividad no existe');
    }

    if (
      actividad.grupo.id_profesor !== profesor.id_profesor
    ) {
      throw new ForbiddenException(
        'No puedes consultar las entregas de esta actividad',
      );
    }

    return this.prisma.entrega.findMany({
      where: {
        id_actividad: idActividad,
      },
      include: {
        matricula: {
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
          },
        },
      },
      orderBy: {
        fecha_entrega: 'asc',
      },
    });
  }

  async grade(
    idUsuario: number,
    idEntrega: number,
    dto: CalificarEntregaDto,
  ) {
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

    const entrega = await this.prisma.entrega.findUnique({
      where: {
        id_entrega: idEntrega,
      },
      include: {
        actividad: {
          include: {
            grupo: true,
          },
        },
      },
    });

    if (!entrega) {
      throw new NotFoundException('La entrega no existe');
    }

    if (
      entrega.actividad.grupo.id_profesor !==
      profesor.id_profesor
    ) {
      throw new ForbiddenException(
        'No puedes calificar esta entrega',
      );
    }

    if (entrega.estado !== EstadoEntrega.ENTREGADA) {
      throw new BadRequestException(
        'La entrega ya fue calificada',
      );
    }

    if (
      dto.puntaje_obtenido >
      Number(entrega.actividad.puntaje_maximo)
    ) {
      throw new BadRequestException(
        'El puntaje obtenido no puede superar el puntaje máximo',
      );
    }

    return this.prisma.entrega.update({
      where: {
        id_entrega: idEntrega,
      },
      data: {
        puntaje_obtenido: dto.puntaje_obtenido,
        observacion_docente:
          dto.observacion_docente?.trim(),
        estado: EstadoEntrega.CALIFICADA,
      },
    });
  }
}