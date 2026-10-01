import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { EstadoMateria } from '../generated/prisma/enums.js';

import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { UpdateMateriaDto } from './dto/update-materia.dto.js';

@Injectable()
export class MateriasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.materia.findMany({
      orderBy: {
        id_materia: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const materia = await this.prisma.materia.findUnique({
      where: {
        id_materia: id,
      },
    });

    if (!materia) {
      throw new NotFoundException(
        'Materia no encontrada',
      );
    }

    return materia;
  }

  async create(dto: CreateMateriaDto) {
    return this.prisma.materia.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        creditos: dto.creditos,
        costos_inscripcion: dto.costos_inscripcion,
        costo_mensual: dto.costo_mensual,
        estado:
          dto.estado ?? EstadoMateria.ACTIVA,
      },
    });
  }

  async update(
    id: number,
    dto: UpdateMateriaDto,
  ) {
    await this.findOne(id);

    return this.prisma.materia.update({
      where: {
        id_materia: id,
      },
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        creditos: dto.creditos,
        costos_inscripcion:
          dto.costos_inscripcion,
        costo_mensual: dto.costo_mensual,
        estado: dto.estado,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.materia.delete({
      where: {
        id_materia: id,
      },
    });

    return {
      message: 'Materia eliminada correctamente',
    };
  }
}