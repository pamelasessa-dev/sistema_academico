import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { EstudiantesService } from './estudiantes.service.js';

@ApiTags('Estudiantes')
@ApiBearerAuth()
@Controller('estudiantes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EstudiantesController {
  constructor(
    private readonly service: EstudiantesService,
  ) {}

  @Get('me')
  @Roles(RolUsuario.ESTUDIANTE)
  @ApiOperation({
    summary: 'Obtener el estudiante del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del estudiante autenticado.',
  })
  @ApiResponse({
    status: 404,
    description: 'El usuario no está asociado a un estudiante.',
  })
  me(@CurrentUser() user: AuthUser) {
    return this.service.me(user.id_usuario);
  }

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA)
  @ApiOperation({
    summary: 'Obtener todos los estudiantes',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estudiantes.',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA)
  @ApiOperation({
    summary: 'Obtener un estudiante por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Estudiante encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Estudiante no encontrado.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}