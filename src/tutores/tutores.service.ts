import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TutoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tutor.findMany({
      select: {
        id_tutor: true,
        nombre: true,
        apellido: true,
        parentesco: true,
        telefono: true,
        email: true,
        direccion: true,
      },
      orderBy: [
        { apellido: 'asc' },
        { nombre: 'asc' },
      ],
    });
  }

  async findOne(id: number) {
    const tutor = await this.prisma.tutor.findUnique({
      where: { id_tutor: id },
      select: {
        id_tutor: true,
        nombre: true,
        apellido: true,
        parentesco: true,
        telefono: true,
        email: true,
        direccion: true,
        estudiantes: {
          select: {
            id_estudiante: true,
            nro_matricula: true,
            fecha_nacimiento: true,
            fecha_ingreso: true,
            usuario: {
              select: {
                id_usuario: true,
                primer_nombre: true,
                segundo_nombre: true,
                primer_apellido: true,
                segundo_apellido: true,
                email: true,
                estado: true,
              },
            },
          },
          orderBy: {
            id_estudiante: 'asc',
          },
        },
      },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor no encontrado');
    }

    return tutor;
  }
}