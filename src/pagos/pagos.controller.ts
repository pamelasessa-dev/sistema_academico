import {
  Body,
  Controller,
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
import type { AuthUser } from '../common/auth/auth-user.js';
import { CurrentUser } from '../common/auth/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { RolUsuario } from '../generated/prisma/enums.js';
import { CreatePagoDto } from './dto/create-pago.dto.js';
import { RechazarPagoDto } from './dto/rechazar-pago.dto.js';
import { PagosService } from './pagos.service.js';

@ApiTags('Pagos')
@ApiBearerAuth()
@Controller('pagos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PagosController {
  constructor(private readonly service: PagosService) {}

  @Post()
  @Roles(RolUsuario.ESTUDIANTE)
  @ApiOperation({
    summary: 'Registrar un pago',
  })
  @ApiResponse({
    status: 201,
    description:
      'Pago registrado en estado PENDIENTE.',
  })
  @ApiResponse({
    status: 400,
    description:
      'La obligación no permite registrar el pago.',
  })
  @ApiResponse({
    status: 403,
    description:
      'La obligación no pertenece al estudiante autenticado.',
  })
  @ApiResponse({
    status: 404,
    description: 'La obligación no existe.',
  })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreatePagoDto,
  ) {
    return this.service.create(user.id_usuario, dto);
  }

  @Patch(':id/aprobar')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
  )
  @ApiOperation({
    summary: 'Aprobar un pago',
  })
  @ApiResponse({
    status: 200,
    description:
      'Pago aprobado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El pago ya fue procesado.',
  })
  @ApiResponse({
    status: 404,
    description: 'El pago no existe.',
  })
  aprobar(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.aprobar(
      user.id_usuario,
      id,
    );
  }

  @Patch(':id/rechazar')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.RECEPCIONISTA,
  )
  @ApiOperation({
    summary: 'Rechazar un pago',
  })
  @ApiResponse({
    status: 200,
    description:
      'Pago rechazado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El pago ya fue procesado.',
  })
  @ApiResponse({
    status: 404,
    description: 'El pago no existe.',
  })
  rechazar(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RechazarPagoDto,
  ) {
    return this.service.rechazar(
      user.id_usuario,
      id,
      dto,
    );
  }
}