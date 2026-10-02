import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegistroDto } from './dto/registro.dto.js';
import type { AuthUser } from '../common/auth/auth-user.js';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  async login(
    @Body() _dto: LoginDto,
    @Req() req: { user: AuthUser },
  ) {
    return this.auth.login(req.user);
  }

  @Post('registro')
  @ApiOperation({
    summary: 'Registrar un postulante a estudiante',
    description:
      'Registra un nuevo postulante con estado PENDIENTE. El usuario no podrá iniciar sesión hasta ser aprobado.',
  })
  @ApiResponse({
    status: 201,
    description: 'Postulante registrado correctamente.',
  })
  @ApiResponse({
    status: 409,
    description: 'El correo electrónico ya está registrado.',
  })
  async registro(@Body() dto: RegistroDto) {
    return this.auth.registro(dto);
  }
}