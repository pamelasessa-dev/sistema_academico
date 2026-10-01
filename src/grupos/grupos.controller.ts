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
import { CreateGrupoDto } from './dto/create-grupo.dto.js';
import { UpdateGrupoDto } from './dto/update-grupo.dto.js';
import { GruposService } from './grupos.service.js';

@ApiTags('Grupos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grupos')
export class GruposController {
  constructor(private readonly gruposService: GruposService) {}

  @Get()
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({ summary: 'Obtener todos los grupos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos obtenida correctamente',
  })
  findAll() {
    return this.gruposService.findAll();
  }

  @Get(':id')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
    RolUsuario.PROFESOR,
    RolUsuario.ESTUDIANTE,
  )
  @ApiOperation({ summary: 'Obtener un grupo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Grupo encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo no encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Crear un grupo' })
  @ApiResponse({
    status: 201,
    description: 'Grupo creado correctamente',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede crear el grupo por una relación inexistente',
  })
  create(@Body() dto: CreateGrupoDto) {
    return this.gruposService.create(dto);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Actualizar un grupo' })
  @ApiResponse({
    status: 200,
    description: 'Grupo actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo no encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGrupoDto,
  ) {
    return this.gruposService.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Eliminar un grupo' })
  @ApiResponse({
    status: 200,
    description: 'Grupo eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gruposService.remove(id);
  }
}