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

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

import { MateriasService } from './materias.service.js';
import { CreateMateriaDto } from './dto/create-materia.dto.js';
import { UpdateMateriaDto } from './dto/update-materia.dto.js';

@Controller('materias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MateriasController {
  constructor(
    private readonly materiasService: MateriasService,
  ) {}

  @Get()
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Listar materias',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de materias obtenida correctamente.',
  })
  findAll() {
    return this.materiasService.findAll();
  }

  @Get(':id')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Obtener una materia por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Materia encontrada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Materia no encontrada.',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.materiasService.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Crear una materia',
  })
  @ApiResponse({
    status: 201,
    description: 'Materia creada correctamente.',
  })
  create(@Body() dto: CreateMateriaDto) {
    return this.materiasService.create(dto);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Modificar una materia',
  })
  @ApiResponse({
    status: 200,
    description: 'Materia modificada correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Materia no encontrada.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMateriaDto,
  ) {
    return this.materiasService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Eliminar una materia',
  })
  @ApiResponse({
    status: 200,
    description: 'Materia eliminada correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Materia no encontrada.',
  })
  @ApiResponse({
    status: 409,
    description:
      'No se puede eliminar la materia porque tiene relaciones existentes.',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.materiasService.remove(id);
  }
}