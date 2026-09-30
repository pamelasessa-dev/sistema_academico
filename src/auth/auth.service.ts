import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  
  ) {}

  async validateUser(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.estado !== 'ACTIVO') {
      throw new UnauthorizedException(
        'El usuario no está activo',
      );
    }

    return {
      id_usuario: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado,
    };
  }

  async login(user:{
    id_usuario:number;
    email:string;
    rol:string;
    estado:string;
  }) {
    const payload = {
      sub: user.id_usuario,
      email: user.email,
      rol: user.rol,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id_usuario: user.id_usuario,
        email: user.email,
        rol:user.rol,
        estado:user.estado,
      },
    };
  }
}