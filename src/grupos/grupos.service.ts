import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  EstadoGrupo,
  EstadoMatricula,
  EstadoPeriodo,
} from '../generated/prisma/enums.js';
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';

@Injectable()
export class GruposService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.grupo.findMany({
      include: {
        materia: true,
        periodo: true,
        profesor: {
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
        aula: true,
      },
      orderBy: {
        id_grupo: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const grupo = await this.prisma.grupo.findUnique({
      where: {
        id_grupo: id,
      },
      include: {
        materia: true,
        periodo: true,
        profesor: {
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
        aula: true,
        horarios: true,
      },
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    return grupo;
  }

  async create(dto: CreateGrupoDto) {
    const [materia, periodo, profesor, aula] =
      await Promise.all([
        this.prisma.materia.findUnique({
          where: { id_materia: dto.id_materia },
        }),
        this.prisma.periodo.findUnique({
          where: { id_periodo: dto.id_periodo },
        }),
        this.prisma.profesor.findUnique({
          where: { id_profesor: dto.id_profesor },
        }),
        this.prisma.aula.findUnique({
          where: { id_aula: dto.id_aula },
        }),
      ]);

    if (!materia) {
      throw new NotFoundException('La materia no existe');
    }

    if (!periodo) {
      throw new NotFoundException('El período no existe');
    }

    if (!profesor) {
      throw new NotFoundException('El profesor no existe');
    }

    if (!aula) {
      throw new NotFoundException('El aula no existe');
    }

    if (periodo.estado !== EstadoPeriodo.ACTIVO) {
      throw new BadRequestException(
        'No se puede crear un grupo en un período que no está activo',
      );
    }

    if (materia.estado !== 'ACTIVA') {
      throw new BadRequestException(
        'No se puede crear un grupo con una materia inactiva',
      );
    }

    if (aula.estado !== 'DISPONIBLE') {
      throw new BadRequestException(
        'No se puede asignar un aula que no está disponible',
      );
    }

    return this.prisma.grupo.create({
      data: {
        id_materia: dto.id_materia,
        id_periodo: dto.id_periodo,
        id_profesor: dto.id_profesor,
        id_aula: dto.id_aula,
        nombre: dto.nombre,
        cupo_maximo: dto.cupo_maximo,
        estado: dto.estado,
      },
    });
  }

  async update(id: number, dto: UpdateGrupoDto) {
    const grupo = await this.findOne(id);

    if (grupo.estado !== EstadoGrupo.ABIERTO) {
      throw new BadRequestException(
        'Solo se pueden modificar grupos en estado ABIERTO',
      );
    }

    if (dto.cupo_maximo !== undefined) {
      const cantidadMatriculas =
        await this.prisma.matricula.count({
          where: {
            id_grupo: id,
            estado: {
              in: [
                EstadoMatricula.PENDIENTE,
                EstadoMatricula.ACTIVA,
              ],
            },
          },
        });

      if (dto.cupo_maximo < cantidadMatriculas) {
        throw new BadRequestException(
          'El cupo máximo no puede ser menor que la cantidad de estudiantes matriculados',
        );
      }
    }

    if (dto.estado === EstadoGrupo.FINALIZADO) {
      throw new BadRequestException(
        'El grupo debe cerrarse antes de finalizar',
      );
    }

    return this.prisma.grupo.update({
      where: {
        id_grupo: id,
      },
      data: {
        nombre: dto.nombre,
        cupo_maximo: dto.cupo_maximo,
        estado: dto.estado,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const [matriculas, actividades, horarios] =
      await Promise.all([
        this.prisma.matricula.count({
          where: { id_grupo: id },
        }),
        this.prisma.actividadAcademica.count({
          where: { id_grupo: id },
        }),
        this.prisma.horario.count({
          where: { id_grupo: id },
        }),
      ]);

    if (matriculas > 0 || actividades > 0 || horarios > 0) {
      throw new BadRequestException(
        'No se puede eliminar el grupo porque tiene registros relacionados',
      );
    }

    await this.prisma.grupo.delete({
      where: {
        id_grupo: id,
      },
    });

    return {
      message: 'Grupo eliminado correctamente',
    };
  }
}