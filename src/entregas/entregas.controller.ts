import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { EntregasService } from './entregas.service.js';
import { CreateEntregaDto } from './dto/create-entrega.dto.js';
import { CalificarEntregaDto } from './dto/calificar-entrega.dto.js';

@ApiTags('Entregas')
@ApiBearerAuth()
@Controller('entregas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EntregasController {
  constructor(private readonly service: EntregasService) {}

  @Post()
  @Roles(RolUsuario.ESTUDIANTE)
  @ApiOperation({ summary: 'Crear una entrega' })
  @ApiResponse({
    status: 201,
    description: 'Entrega creada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o actividad no disponible.',
  })
  @ApiResponse({
    status: 403,
    description: 'El estudiante no tiene permiso para realizar la entrega.',
  })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateEntregaDto,
  ) {
    return this.service.create(user.id_usuario, dto);
  }

  @Get('me')
  @Roles(RolUsuario.ESTUDIANTE)
  @ApiOperation({ summary: 'Consultar mis entregas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de entregas del estudiante.',
  })
  findMy(@CurrentUser() user: AuthUser) {
    return this.service.findMy(user.id_usuario);
  }

  @Get('actividad/:idActividad')
  @Roles(RolUsuario.PROFESOR)
  @ApiOperation({
    summary: 'Consultar las entregas de una actividad',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de entregas de la actividad.',
  })
  @ApiResponse({
    status: 403,
    description: 'El profesor no es responsable de la actividad.',
  })
  findByActivity(
    @CurrentUser() user: AuthUser,
    @Param('idActividad', ParseIntPipe) idActividad: number,
  ) {
    return this.service.findByActivity(
      user.id_usuario,
      idActividad,
    );
  }

  @Post(':id/calificar')
  @Roles(RolUsuario.PROFESOR)
  @ApiOperation({ summary: 'Calificar una entrega' })
  @ApiResponse({
    status: 201,
    description: 'Entrega calificada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El puntaje no es válido.',
  })
  @ApiResponse({
    status: 403,
    description: 'El profesor no puede calificar esta entrega.',
  })
  grade(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) idEntrega: number,
    @Body() dto: CalificarEntregaDto,
  ) {
    return this.service.grade(
      user.id_usuario,
      idEntrega,
      dto,
    );
  }
}