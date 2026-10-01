import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateAulaDto } from './dto/create-aula.dto.js';
import { UpdateAulaDto } from './dto/update-aula.dto.js';
import { EstadoAula } from '../generated/prisma/enums.js';

@Injectable()
export class AulasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.aula.findMany({
      orderBy: {
        id_aula: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const aula = await this.prisma.aula.findUnique({
      where: {
        id_aula: id,
      },
    });

    if (!aula) {
      throw new NotFoundException(
        'Aula no encontrada',
      );
    }

    return aula;
  }

  async create(dto: CreateAulaDto) {
    return this.prisma.aula.create({
      data: {
        nombre: dto.nombre,
        capacidad: dto.capacidad,
        ubicacion: dto.ubicacion,
        tipo: dto.tipo,
        estado: dto.estado ?? EstadoAula.DISPONIBLE,
      },
    });
  }

  async update(id: number, dto: UpdateAulaDto) {
    await this.findOne(id);

    return this.prisma.aula.update({
      where: {
        id_aula: id,
      },
      data: {
        nombre: dto.nombre,
        capacidad: dto.capacidad,
        ubicacion: dto.ubicacion,
        tipo: dto.tipo,
        estado: dto.estado,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.aula.delete({
      where: {
        id_aula: id,
      },
    });

    return {
      message: 'Aula eliminada correctamente',
    };
  }
}