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
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { RolUsuario } from '../generated/prisma/enums.js';
import { AulasService } from './aulas.service.js';
import { CreateAulaDto } from './dto/create-aula.dto.js';
import { UpdateAulaDto } from './dto/update-aula.dto.js';

@ApiTags('Aulas')
@ApiBearerAuth()
@Controller('aulas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AulasController {
  constructor(private readonly aulasService: AulasService) {}

  @Get()
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Listar aulas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de aulas obtenida correctamente.',
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
    return this.aulasService.findAll();
  }

  @Get(':id')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Obtener un aula por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Aula encontrada.',
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
    description: 'Aula no encontrada.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.aulasService.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Crear un aula',
  })
  @ApiResponse({
    status: 201,
    description: 'Aula creada correctamente.',
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
    description: 'Solo ADMIN puede crear aulas.',
  })
  create(@Body() dto: CreateAulaDto) {
    return this.aulasService.create(dto);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Actualizar un aula',
  })
  @ApiResponse({
    status: 200,
    description: 'Aula actualizada correctamente.',
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
    description: 'Solo ADMIN puede modificar aulas.',
  })
  @ApiResponse({
    status: 404,
    description: 'Aula no encontrada.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAulaDto,
  ) {
    return this.aulasService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Eliminar un aula',
  })
  @ApiResponse({
    status: 200,
    description: 'Aula eliminada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar un aula asociada a grupos.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado.',
  })
  @ApiResponse({
    status: 403,
    description: 'Solo ADMIN puede eliminar aulas.',
  })
  @ApiResponse({
    status: 404,
    description: 'Aula no encontrada.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aulasService.remove(id);
  }
}