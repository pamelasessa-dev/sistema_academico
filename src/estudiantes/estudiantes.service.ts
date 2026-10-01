import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EstudiantesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async me(idUsuario: number) {
    const estudiante =
      await this.prisma.estudiante.findUnique({
        where: {
          id_usuario: idUsuario,
        },
        include: {
          tutor: true,
          usuario: {
            select: {
              id_usuario: true,
              email: true,
              estado: true,
              rol: true,
              primer_nombre: true,
              segundo_nombre: true,
              primer_apellido: true,
              segundo_apellido: true,
              telefono: true,
            },
          },
        },
      });

    if (!estudiante) {
      throw new NotFoundException(
        'El usuario autenticado no está asociado a un estudiante',
      );
    }

    return estudiante;
  }

  async findOne(id: number) {
    const estudiante =
      await this.prisma.estudiante.findUnique({
        where: {
          id_estudiante: id,
        },
        include: {
          tutor: true,
          usuario: {
            select: {
              id_usuario: true,
              email: true,
              estado: true,
              rol: true,
              primer_nombre: true,
              segundo_nombre: true,
              primer_apellido: true,
              segundo_apellido: true,
              telefono: true,
            },
          },
        },
      });

    if (!estudiante) {
      throw new NotFoundException(
        'Estudiante no encontrado',
      );
    }

    return estudiante;
  }

  findAll() {
    return this.prisma.estudiante.findMany({
      include: {
        tutor: true,
        usuario: {
          select: {
            id_usuario: true,
            email: true,
            estado: true,
            rol: true,
            primer_nombre: true,
            segundo_nombre: true,
            primer_apellido: true,
            segundo_apellido: true,
            telefono: true,
          },
        },
      },
      orderBy: {
        id_estudiante: 'asc',
      },
    });
  }
}