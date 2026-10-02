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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MatriculasService } from './matriculas.service.js';
import { CreateMatriculaDto } from './dto/create-matricula.dto.js';

import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/auth/current-user.decorator.js';
import type { AuthUser } from '../common/auth/auth-user.js';

import { RolUsuario } from '../generated/prisma/enums.js';

@ApiTags('Matrículas')
@ApiBearerAuth()
@Controller('matriculas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatriculasController {
  constructor(
    private readonly matriculasService: MatriculasService,
  ) {}

  @Get('mis-matriculas')
  @Roles(RolUsuario.ESTUDIANTE)
  @ApiOperation({
    summary: 'Consultar mis matrículas',
  })
  @ApiResponse({
    status: 200,
    description:
      'Lista de matrículas del estudiante autenticado.',
  })
  @ApiResponse({
    status: 404,
    description:
      'El usuario no está asociado a un estudiante.',
  })
  findMyEnrollments(@CurrentUser() user: AuthUser) {
    return this.matriculasService.findMyEnrollments(
      user.id_usuario,
    );
  }

  @Post()
  @Roles(RolUsuario.ESTUDIANTE)
  @ApiOperation({
    summary: 'Solicitar una matrícula',
  })
  @ApiResponse({
    status: 201,
    description:
      'Matrícula creada en estado PENDIENTE junto con su obligación financiera.',
  })
  @ApiResponse({
    status: 400,
    description:
      'El grupo no permite la matrícula.',
  })
  @ApiResponse({
    status: 401,
    description:
      'JWT ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description:
      'El usuario no puede realizar matrículas.',
  })
  @ApiResponse({
    status: 404,
    description:
      'El estudiante o grupo no existe.',
  })
  @ApiResponse({
    status: 409,
    description:
      'El estudiante ya está matriculado en la materia o no quedan cupos disponibles.',
  })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateMatriculaDto,
  ) {
    return this.matriculasService.create(
      user.id_usuario,
      dto,
    );
  }

  @Patch(':id/activar')
  @Roles(RolUsuario.RECEPCIONISTA)
  @ApiOperation({
    summary: 'Activar una matrícula',
    description:
      'Activa una matrícula pendiente cuando la inscripción cuenta con un pago aprobado y suficiente.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Matrícula activada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'La matrícula no puede ser activada.',
  })
  @ApiResponse({
    status: 401,
    description:
      'JWT ausente, inválido o expirado.',
  })
  @ApiResponse({
    status: 403,
    description:
      'El usuario no tiene permisos para activar matrículas.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Matrícula no encontrada.',
  })
  @ApiResponse({
    status: 409,
    description:
      'La matrícula ya fue activada o no cumple las condiciones para activarse.',
  })
  activar(
    @Param('id', ParseIntPipe) idMatricula: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.matriculasService.activar(
      idMatricula,
      user.id_usuario,
    );
  }
}