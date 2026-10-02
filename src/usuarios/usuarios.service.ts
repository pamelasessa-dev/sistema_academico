import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service.js';

import {
  EstadoUsuario,
  RolUsuario,
} from '../generated/prisma/enums.js';

import { UpdateUsuarioEstadoDto } from './dto/update-usuario-estado.dto.js';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto.js';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id_usuario: true,
        primer_nombre: true,
        segundo_nombre: true,
        primer_apellido: true,
        segundo_apellido: true,
        email: true,
        telefono: true,
        rol: true,
        estado: true,
        fecha_creacion: true,
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const usuario =
      await this.prisma.usuario.findUnique({
        where: {
          id_usuario: id,
        },
        select: {
          id_usuario: true,
          primer_nombre: true,
          segundo_nombre: true,
          primer_apellido: true,
          segundo_apellido: true,
          email: true,
          telefono: true,
          rol: true,
          estado: true,
          fecha_creacion: true,
        },
      });

    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    return usuario;
  }

  async changeOwnPassword(
    idUsuario: number,
    dto: ChangeOwnPasswordDto,
  ) {
    const usuario =
      await this.prisma.usuario.findUnique({
        where: {
          id_usuario: idUsuario,
        },
        select: {
          password: true,
        },
      });

    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    const passwordCorrecta =
      await bcrypt.compare(
        dto.currentPassword,
        usuario.password,
      );

    if (!passwordCorrecta) {
      throw new UnauthorizedException(
        'La contraseña actual es incorrecta',
      );
    }

    if (
      dto.currentPassword === dto.newPassword
    ) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual',
      );
    }

    const passwordHash =
      await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.usuario.update({
      where: {
        id_usuario: idUsuario,
      },
      data: {
        password: passwordHash,
      },
    });

    return {
      mensaje:
        'Contraseña actualizada correctamente',
    };
  }

  async aprobarPostulante(
    idPostulante: number,
    idRecepcionista: number,
  ) {
    const usuario =
      await this.prisma.usuario.findUnique({
        where: {
          id_usuario: idPostulante,
        },
        include: {
          estudiante: true,
        },
      });

    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    if (
      usuario.rol !== RolUsuario.ESTUDIANTE
    ) {
      throw new BadRequestException(
        'Solo se pueden aprobar usuarios con rol ESTUDIANTE',
      );
    }

    if (
      usuario.estado !==
      EstadoUsuario.PENDIENTE
    ) {
      throw new BadRequestException(
        'El usuario no se encuentra pendiente de aprobación',
      );
    }

    if (!usuario.estudiante) {
      throw new NotFoundException(
        'El usuario no tiene un registro de estudiante asociado',
      );
    }

    // Matrícula definitiva: EST-AAAA-0000
    const anio = new Date().getFullYear();

    const nroMatricula =
      `EST-${anio}-${String(
        usuario.estudiante.id_estudiante,
      ).padStart(4, '0')}`;

    const fechaIngreso = new Date();

    return this.prisma.$transaction(
      async (tx) => {
        const estudiante =
          await tx.estudiante.update({
            where: {
              id_estudiante:
                usuario.estudiante!.id_estudiante,
            },
            data: {
              nro_matricula: nroMatricula,
              fecha_ingreso: fechaIngreso,
            },
          });

        const usuarioActualizado =
          await tx.usuario.update({
            where: {
              id_usuario:
                usuario.id_usuario,
            },
            data: {
              estado: EstadoUsuario.ACTIVO,
            },
            select: {
              id_usuario: true,
              primer_nombre: true,
              segundo_nombre: true,
              primer_apellido: true,
              segundo_apellido: true,
              email: true,
              telefono: true,
              rol: true,
              estado: true,
            },
          });

        await tx.auditoria.create({
          data: {
            id_usuario: idRecepcionista,
            entidad: 'Usuario',
            id_registro: usuario.id_usuario,
            accion: 'APROBAR_POSTULANTE',
            valor_anterior: {
              estado: usuario.estado,
              nro_matricula:
                usuario.estudiante!
                  .nro_matricula,
            },
            valor_nuevo: {
              estado:
                EstadoUsuario.ACTIVO,
              nro_matricula:
                estudiante.nro_matricula,
              fecha_ingreso:
                estudiante.fecha_ingreso,
            },
            detalle:
              'Postulante aprobado por Recepción',
          },
        });

        return {
          mensaje:
            'Postulante aprobado correctamente',
          usuario: usuarioActualizado,
          estudiante: {
            id_estudiante:
              estudiante.id_estudiante,
            nro_matricula:
              estudiante.nro_matricula,
            fecha_ingreso:
              estudiante.fecha_ingreso,
          },
        };
      },
    );
  }

  async updateEstado(
    id: number,
    dto: UpdateUsuarioEstadoDto,
  ) {
    const usuario =
      await this.prisma.usuario.findUnique({
        where: {
          id_usuario: id,
        },
        select: {
          id_usuario: true,
          rol: true,
          estado: true,
        },
      });

    if (!usuario) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    if (
      usuario.rol === RolUsuario.ADMIN &&
      dto.estado ===
        EstadoUsuario.SUSPENDIDO
    ) {
      throw new BadRequestException(
        'No se puede suspender un usuario con rol ADMIN',
      );
    }

    return this.prisma.usuario.update({
      where: {
        id_usuario: id,
      },
      data: {
        estado: dto.estado,
      },
      select: {
        id_usuario: true,
        primer_nombre: true,
        segundo_nombre: true,
        primer_apellido: true,
        segundo_apellido: true,
        email: true,
        telefono: true,
        rol: true,
        estado: true,
        fecha_creacion: true,
      },
    });
  }
}