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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
  constructor(
    private readonly actividadesService: ActividadesService,
  ) {}

  @Post()
  @Roles(RolUsuario.PROFESOR)
  @ApiOperation({
    summary: 'Crear actividad del grupo del profesor',
  })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateActividadDto,
  ) {
    return this.actividadesService.create(user.id_usuario, dto);
  }

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
    @Param('idGrupo', ParseIntPipe) idGrupo: number,
  ) {
    return this.actividadesService.findByGroup(idGrupo);
  }

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.actividadesService.findOne(id);
  }

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
    return this.actividadesService.update(
      user.id_usuario,
      id,
      dto,
    );
  }

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
    return this.actividadesService.updateEstado(
      user.id_usuario,
      id,
      dto,
    );
  }
}