import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { UsuariosService } from './usuarios.service.js';
import { UpdateUsuarioEstadoDto } from './dto/update-usuario-estado.dto.js';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA)
  @ApiOperation({ summary: 'Listar usuarios sin contraseñas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida correctamente',
  })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMIN, RolUsuario.RECEPCIONISTA)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id/estado')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Actualizar el estado de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Estado del usuario actualizado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioEstadoDto,
  ) {
    return this.usuariosService.updateEstado(id, dto);
  }
}