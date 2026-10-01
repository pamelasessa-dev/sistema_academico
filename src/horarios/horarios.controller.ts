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
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolUsuario } from '../generated/prisma/enums.js';
import { CreateHorarioDto } from './dto/create-horario.dto.js';
import { UpdateHorarioDto } from './dto/update-horario.dto.js';
import { HorariosService } from './horarios.service.js';

@ApiTags('Horarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Get()
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({ summary: 'Obtener todos los horarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de horarios obtenida correctamente',
  })
  findAll() {
    return this.horariosService.findAll();
  }

  @Get(':id')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({ summary: 'Obtener un horario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Horario encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Horario no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.horariosService.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Crear un horario' })
  @ApiResponse({
    status: 201,
    description: 'Horario creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o rango horario incorrecto',
  })
  create(@Body() dto: CreateHorarioDto) {
    return this.horariosService.create(dto);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Actualizar un horario' })
  @ApiResponse({
    status: 200,
    description: 'Horario actualizado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o rango horario incorrecto',
  })
  @ApiResponse({
    status: 404,
    description: 'Horario no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHorarioDto,
  ) {
    return this.horariosService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Eliminar un horario' })
  @ApiResponse({
    status: 200,
    description: 'Horario eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Horario no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.horariosService.remove(id);
  }
}