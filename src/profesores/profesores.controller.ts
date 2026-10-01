import {
  Body,
  Controller,
  Delete,
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
  ApiResponse,
} from '@nestjs/swagger';

import { RolUsuario } from '../generated/prisma/enums.js';

import { ProfesoresService } from './profesores.service.js';
import { CreateProfesorDto } from './dto/create-profesor.dto.js';
import { UpdateProfesorDto } from './dto/update-profesor.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('profesores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfesoresController {
  constructor(
    private readonly profesoresService: ProfesoresService,
  ) {}

  @Get()
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Listar profesores',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de profesores obtenida correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos suficientes.',
  })
  findAll() {
    return this.profesoresService.findAll();
  }

  @Get(':id')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Obtener un profesor por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Profesor encontrado.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos suficientes.',
  })
  @ApiResponse({
    status: 404,
    description: 'Profesor no encontrado.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.profesoresService.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Crear un profesor',
  })
  @ApiResponse({
    status: 201,
    description: 'Profesor creado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo ADMIN puede crear profesores.',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya existe.',
  })
  create(@Body() dto: CreateProfesorDto) {
    return this.profesoresService.create(dto);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Actualizar un profesor',
  })
  @ApiResponse({
    status: 200,
    description: 'Profesor actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo ADMIN puede modificar profesores.',
  })
  @ApiResponse({
    status: 404,
    description: 'Profesor no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya existe.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfesorDto,
  ) {
    return this.profesoresService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Eliminar un profesor',
  })
  @ApiResponse({
    status: 200,
    description: 'Profesor eliminado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo ADMIN puede eliminar profesores.',
  })
  @ApiResponse({
    status: 404,
    description: 'Profesor no encontrado.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.profesoresService.remove(id);
  }
}