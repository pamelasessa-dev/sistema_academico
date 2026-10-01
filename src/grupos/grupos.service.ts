import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';

@Injectable()
export class GruposService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.grupo.findMany({
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
    });

    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    return grupo;
  }

  async create(dto: CreateGrupoDto) {
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
    await this.findOne(id);

    return this.prisma.grupo.update({
      where: {
        id_grupo: id,
      },
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

  async remove(id: number) {
    await this.findOne(id);

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