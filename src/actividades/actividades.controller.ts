import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthUser } from '../common/auth/auth-user.js';
import { CurrentUser } from '../common/auth/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { RolUsuario } from '../generated/prisma/enums.js';

import { ActividadesService } from './actividades.service.js';
import { CreateActividadDto } from './dto/create-actividad.dto.js';
import { UpdateActividadDto } from './dto/update-actividad.dto.js';
import { UpdateEstadoActividadDto } from './dto/update-estado-actividad.dto.js';

@ApiTags('Actividades')
@ApiBearerAuth()
@Controller('actividades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  /**
   * Crear una actividad.
   * Solamente profesores.
   */
  @Post()
  @Roles(RolUsuario.PROFESOR)
  @ApiOperation({
    summary: 'Crear actividad del grupo del profesor',
  })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateActividadDto) {
    return this.actividadesService.create(user.id_usuario, dto);
  }

  /**
   * Obtener actividades de un grupo.
   * Los permisos y filtros se verifican en el servicio.
   */
  @Get('grupo/:idGrupo')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Obtener actividades de un grupo',
  })
  findByGroup(
    @CurrentUser() user: AuthUser,
    @Param('idGrupo', ParseIntPipe) idGrupo: number,
  ) {
    return this.actividadesService.findByGroup(
      user.id_usuario,
      user.rol,
      idGrupo,
    );
  }

  /**
   * Obtener una actividad por ID.
   * Los permisos se verifican en el servicio.
   */
  @Get(':id')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Obtener una actividad por ID',
  })
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.actividadesService.findOne(user.id_usuario, user.rol, id);
  }

  /**
   * Actualizar una actividad.
   * Solamente el profesor responsable.
   */
  @Patch(':id')
  @Roles(RolUsuario.PROFESOR)
  @ApiOperation({
    summary: 'Actualizar una actividad',
  })
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActividadDto,
  ) {
    return this.actividadesService.update(user.id_usuario, id, dto);
  }

  /**
   * Cambiar el estado de una actividad.
   * Solamente el profesor responsable.
   */
  @Patch(':id/estado')
  @Roles(RolUsuario.PROFESOR)
  @ApiOperation({
    summary: 'Cambiar el estado de una actividad',
  })
  updateEstado(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoActividadDto,
  ) {
    return this.actividadesService.updateEstado(user.id_usuario, id, dto);
  }
}
