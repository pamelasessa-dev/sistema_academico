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
import { CreatePeriodoDto } from './dto/create-periodo.dto.js';
import { UpdatePeriodoDto } from './dto/update-periodo.dto.js';
import { PeriodosService } from './periodos.service.js';

@ApiTags('Períodos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('periodos')
export class PeriodosController {
  constructor(
    private readonly periodosService: PeriodosService,
  ) {}

  @Get()
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Obtener todos los períodos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de períodos obtenida correctamente',
  })
  findAll() {
    return this.periodosService.findAll();
  }

  @Get(':id')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({
    summary: 'Obtener un período por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Período encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Período no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.periodosService.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Crear un período',
  })
  @ApiResponse({
    status: 201,
    description: 'Período creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o fechas incorrectas',
  })
  create(@Body() dto: CreatePeriodoDto) {
    return this.periodosService.create(dto);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Actualizar un período',
  })
  @ApiResponse({
    status: 200,
    description: 'Período actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Período no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o fechas incorrectas',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePeriodoDto,
  ) {
    return this.periodosService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Eliminar un período',
  })
  @ApiResponse({
    status: 200,
    description: 'Período eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Período no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.periodosService.remove(id);
  }
}