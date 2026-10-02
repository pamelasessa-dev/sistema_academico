import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/auth/current-user.decorator.js';
import type { AuthUser } from '../common/auth/auth-user.js';

import { RolUsuario } from '../generated/prisma/enums.js';

import { UsuariosService } from './usuarios.service.js';
import { UpdateUsuarioEstadoDto } from './dto/update-usuario-estado.dto.js';
import { ChangeOwnPasswordDto } from './dto/change-own-password.dto.js';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
  ) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA)
  @ApiOperation({
    summary: 'Listar usuarios',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de usuarios obtenida correctamente',
  })
  @ApiResponse({
    status: 401,
    description:
      'JWT ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description:
      'El rol no tiene permisos.',
  })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA)
  @ApiOperation({
    summary: 'Obtener un usuario por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 401,
    description:
      'JWT ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description:
      'El rol no tiene permisos.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.usuariosService.findOne(id);
  }

  @Patch('me/password')
  @ApiOperation({
    summary: 'Cambiar mi contraseña',
  })
  @ApiResponse({
    status: 200,
    description:
      'Contraseña actualizada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description:
      'La contraseña actual es incorrecta.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Usuario no encontrado.',
  })
  changeOwnPassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangeOwnPasswordDto,
  ) {
    return this.usuariosService.changeOwnPassword(
      user.id_usuario,
      dto,
    );
  }

  @Patch(':id/aprobar')
  @Roles(RolUsuario.RECEPCIONISTA)
  @ApiOperation({
    summary: 'Aprobar un postulante a estudiante',
    description:
      'Activa un usuario PENDIENTE, genera su matrícula definitiva y registra la aprobación.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Postulante aprobado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'El usuario no puede ser aprobado.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Usuario o estudiante no encontrado.',
  })
  aprobarPostulante(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.usuariosService.aprobarPostulante(
      id,
      user.id_usuario,
    );
  }

  @Patch(':id/estado')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Actualizar el estado de un usuario',
  })
  @ApiResponse({
    status: 200,
    description:
      'Estado del usuario actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Regla de negocio inválida.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Usuario no encontrado.',
  })
  @ApiResponse({
  status: 403,
  description: 'El usuario no tiene permisos para cambiar el estado de otros usuarios.',
})
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioEstadoDto,
  ) {
    return this.usuariosService.updateEstado(
      id,
      dto,
    );
  }
}