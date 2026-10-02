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
import { ObligacionesService } from './obligaciones.service.js';

@ApiTags('Obligaciones')
@ApiBearerAuth()
@Controller('obligaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ObligacionesController {
  constructor(private readonly service: ObligacionesService) {}

  @Get('me')
  @Roles(RolUsuario.ESTUDIANTE)
  @ApiOperation({
    summary: 'Consultar mis obligaciones financieras',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de obligaciones del estudiante.',
  })
  findMy(@CurrentUser() user: AuthUser) {
    return this.service.findMy(user.id_usuario);
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA)
  @ApiOperation({
    summary: 'Consultar una obligación financiera',
  })
  @ApiResponse({
    status: 200,
    description: 'Obligación encontrada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Obligación no encontrada.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}