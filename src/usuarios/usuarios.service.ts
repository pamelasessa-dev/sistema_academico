import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoUsuario, RolUsuario } from '../generated/prisma/enums.js';
import { UpdateUsuarioEstadoDto } from './dto/update-usuario-estado.dto.js';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

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
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
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
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async updateEstado(id: number, dto: UpdateUsuarioEstadoDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: {
        id_usuario: true,
        rol: true,
        estado: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (
      usuario.rol === RolUsuario.ADMIN &&
      dto.estado === EstadoUsuario.SUSPENDIDO
    ) {
      throw new BadRequestException(
        'No se puede suspender un usuario con rol ADMIN',
      );
    }

    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data: { estado: dto.estado },
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