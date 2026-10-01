import {
  Body,
  Controller,
  Get,
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
    description: 'Lista de matrículas del estudiante autenticado.',
  })
  @ApiResponse({
    status: 404,
    description: 'El usuario no está asociado a un estudiante.',
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
    description: 'El grupo no permite la matrícula.',
  })
  @ApiResponse({
    status: 404,
    description: 'El estudiante o grupo no existe.',
  })
  @ApiResponse({
    status: 409,
    description: 'El estudiante ya tiene una matrícula para ese grupo.',
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
}