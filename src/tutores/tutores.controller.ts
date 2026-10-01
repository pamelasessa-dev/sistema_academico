import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolUsuario } from '../generated/prisma/enums.js';
import { TutoresService } from './tutores.service.js';

@ApiTags('Tutores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tutores')
export class TutoresController {
  constructor(private readonly tutoresService: TutoresService) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA)
  @ApiOperation({ summary: 'Listar tutores' })
  @ApiResponse({ status: 200, description: 'Lista de tutores obtenida correctamente' })
  findAll() {
    return this.tutoresService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA)
  @ApiOperation({ summary: 'Obtener un tutor por ID' })
  @ApiResponse({ status: 200, description: 'Tutor encontrado' })
  @ApiResponse({ status: 404, description: 'Tutor no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tutoresService.findOne(id);
  }
}