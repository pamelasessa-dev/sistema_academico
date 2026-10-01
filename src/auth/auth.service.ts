import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  EstadoUsuario,
  RolUsuario,
} from '../generated/prisma/enums.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (
      !usuario ||
      !(await bcrypt.compare(password, usuario.password))
    ) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.estado !== EstadoUsuario.ACTIVO) {
      throw new UnauthorizedException('El usuario no está activo');
    }

    return {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol,
    };
  }

  async login(user: {
    id_usuario: number;
    email: string;
    rol: RolUsuario;
  }) {
    const payload = {
      sub: user.id_usuario,
      email: user.email,
      rol: user.rol,
    };

    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') ?? '8h';

    return {
      access_token: await this.jwt.signAsync(payload, {
        expiresIn: expiresIn as any,
      }),
      user: {
        id_usuario: user.id_usuario,
        email: user.email,
        rol: user.rol,
      },
    };
  }
}