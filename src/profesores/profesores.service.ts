import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  RolUsuario,
  EstadoUsuario,
} from '../generated/prisma/enums.js';
import { CreateProfesorDto } from './dto/create-profesor.dto.js';
import { UpdateProfesorDto } from './dto/update-profesor.dto.js';

@Injectable()
export class ProfesoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.profesor.findMany({
      select: {
        id_profesor: true,
        especialidad: true,
        fecha_contratacion: true,
        usuario: {
          select: {
            id_usuario: true,
            primer_nombre: true,
            segundo_nombre: true,
            primer_apellido: true,
            segundo_apellido: true,
            email: true,
            rol: true,
            estado: true,
          },
        },
      },
      orderBy: {
        id_profesor: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const profesor = await this.prisma.profesor.findUnique({
      where: {
        id_profesor: id,
      },
      select: {
        id_profesor: true,
        especialidad: true,
        fecha_contratacion: true,
        usuario: {
          select: {
            id_usuario: true,
            primer_nombre: true,
            segundo_nombre: true,
            primer_apellido: true,
            segundo_apellido: true,
            email: true,
            rol: true,
            estado: true,
          },
        },
      },
    });

    if (!profesor) {
      throw new NotFoundException(
        'Profesor no encontrado',
      );
    }

    return profesor;
  }

  async create(dto: CreateProfesorDto) {
    const passwordHash = await bcrypt.hash(
      dto.password,
      10,
    );

    try {
      return await this.prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.create({
          data: {
            primer_nombre: dto.primer_nombre,
            segundo_nombre: dto.segundo_nombre,
            primer_apellido: dto.primer_apellido,
            segundo_apellido: dto.segundo_apellido,
            email: dto.email,
            password: passwordHash,
            rol: RolUsuario.PROFESOR,
            estado: EstadoUsuario.ACTIVO,
          },
        });

        const profesor = await tx.profesor.create({
          data: {
            id_usuario: usuario.id_usuario,
            especialidad: dto.especialidad,
            fecha_contratacion: new Date(
              dto.fecha_contratacion,
            ),
          },
        });

        return {
          id_profesor: profesor.id_profesor,
          especialidad: profesor.especialidad,
          fecha_contratacion:
            profesor.fecha_contratacion,
          usuario: {
            id_usuario: usuario.id_usuario,
            primer_nombre: usuario.primer_nombre,
            segundo_nombre: usuario.segundo_nombre,
            primer_apellido: usuario.primer_apellido,
            segundo_apellido: usuario.segundo_apellido,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
          },
        };
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException(
          'El email ya existe',
        );
      }

      throw error;
    }
  }

  async update(id: number, dto: UpdateProfesorDto) {
    const profesor = await this.prisma.profesor.findUnique({
      where: {
        id_profesor: id,
      },
    });

    if (!profesor) {
      throw new NotFoundException(
        'Profesor no encontrado',
      );
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        const usuario = await tx.usuario.update({
          where: {
            id_usuario: profesor.id_usuario,
          },
          data: {
            ...(dto.primer_nombre !== undefined && {
              primer_nombre: dto.primer_nombre,
            }),
            ...(dto.segundo_nombre !== undefined && {
              segundo_nombre: dto.segundo_nombre,
            }),
            ...(dto.primer_apellido !== undefined && {
              primer_apellido: dto.primer_apellido,
            }),
            ...(dto.segundo_apellido !== undefined && {
              segundo_apellido: dto.segundo_apellido,
            }),
            ...(dto.email !== undefined && {
              email: dto.email,
            }),
          },
        });

        const profesorActualizado =
          await tx.profesor.update({
            where: {
              id_profesor: id,
            },
            data: {
              ...(dto.especialidad !== undefined && {
                especialidad: dto.especialidad,
              }),
              ...(dto.fecha_contratacion !== undefined && {
                fecha_contratacion: new Date(
                  dto.fecha_contratacion,
                ),
              }),
            },
          });

        return {
          id_profesor: profesorActualizado.id_profesor,
          especialidad:
            profesorActualizado.especialidad,
          fecha_contratacion:
            profesorActualizado.fecha_contratacion,
          usuario: {
            id_usuario: usuario.id_usuario,
            primer_nombre: usuario.primer_nombre,
            segundo_nombre: usuario.segundo_nombre,
            primer_apellido: usuario.primer_apellido,
            segundo_apellido: usuario.segundo_apellido,
            email: usuario.email,
            rol: usuario.rol,
            estado: usuario.estado,
          },
        };
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException(
          'El email ya existe',
        );
      }

      throw error;
    }
  }

  async remove(id: number) {
    const profesor = await this.prisma.profesor.findUnique({
      where: {
        id_profesor: id,
      },
    });

    if (!profesor) {
      throw new NotFoundException(
        'Profesor no encontrado',
      );
    }

    const grupos = await this.prisma.grupo.count({
      where: {
        id_profesor: id,
      },
    });

    if (grupos > 0) {
      throw new ConflictException(
        'No se puede eliminar el profesor porque tiene grupos asociados',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.profesor.delete({
        where: {
          id_profesor: id,
        },
      });

      await tx.usuario.delete({
        where: {
          id_usuario: profesor.id_usuario,
        },
      });
    });

    return {
      message: 'Profesor eliminado correctamente',
      id_profesor: id,
    };
  }
}