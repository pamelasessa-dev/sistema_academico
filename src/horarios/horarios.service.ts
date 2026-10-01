import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateHorarioDto } from './dto/create-horario.dto.js';
import { UpdateHorarioDto } from './dto/update-horario.dto.js';

@Injectable()
export class HorariosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.horario.findMany({
      orderBy: {
        id_horario: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const horario = await this.prisma.horario.findUnique({
      where: {
        id_horario: id,
      },
    });

    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

    return horario;
  }

  private convertirHora(hora: string): Date {
    const [horas, minutos] = hora.split(':').map(Number);

    const fecha = new Date(1970, 0, 1);
    fecha.setHours(horas, minutos, 0, 0);

    return fecha;
  }

  async create(dto: CreateHorarioDto) {
    const horaInicio = this.convertirHora(dto.hora_inicio);
    const horaFin = this.convertirHora(dto.hora_fin);

    if (horaFin <= horaInicio) {
      throw new BadRequestException(
        'La hora de finalización debe ser posterior a la hora de inicio',
      );
    }

    return this.prisma.horario.create({
      data: {
        id_grupo: dto.id_grupo,
        dia_semana: dto.dia_semana,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
      },
    });
  }

  async update(id: number, dto: UpdateHorarioDto) {
    const horarioActual = await this.findOne(id);

    const horaInicio = dto.hora_inicio
      ? this.convertirHora(dto.hora_inicio)
      : horarioActual.hora_inicio;

    const horaFin = dto.hora_fin
      ? this.convertirHora(dto.hora_fin)
      : horarioActual.hora_fin;

    if (horaFin <= horaInicio) {
      throw new BadRequestException(
        'La hora de finalización debe ser posterior a la hora de inicio',
      );
    }

    return this.prisma.horario.update({
      where: {
        id_horario: id,
      },
      data: {
        id_grupo: dto.id_grupo,
        dia_semana: dto.dia_semana,
        hora_inicio: dto.hora_inicio
          ? horaInicio
          : undefined,
        hora_fin: dto.hora_fin
          ? horaFin
          : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.horario.delete({
      where: {
        id_horario: id,
      },
    });

    return {
      message: 'Horario eliminado correctamente',
    };
  }
}