import {
  ConflictException,
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
import type { RegistroDto } from './dto/registro.dto.js';

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

    const expiresIn =
      this.config.get<string>('JWT_EXPIRES_IN') ?? '8h';

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

  async registro(dto: RegistroDto) {
    const email = dto.email.trim().toLowerCase();

    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'El correo electrónico ya está registrado',
      );
    }

    const fechaNacimiento = new Date(dto.fecha_nacimiento);

    if (Number.isNaN(fechaNacimiento.getTime())) {
      throw new ConflictException(
        'La fecha de nacimiento no es válida',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const tutor = await tx.tutor.create({
        data: {
          nombre: dto.tutor_nombre.trim(),
          apellido: dto.tutor_apellido.trim(),
          parentesco: dto.tutor_parentesco.trim(),
          telefono: dto.tutor_telefono.trim(),
          email: dto.tutor_email?.trim().toLowerCase(),
          direccion: dto.tutor_direccion?.trim(),
        },
      });

      const usuario = await tx.usuario.create({
        data: {
          primer_nombre: dto.primer_nombre.trim(),
          segundo_nombre: dto.segundo_nombre?.trim(),
          primer_apellido: dto.primer_apellido.trim(),
          segundo_apellido: dto.segundo_apellido?.trim(),
          email,
          telefono: dto.telefono?.trim(),
          password: passwordHash,
          rol: RolUsuario.ESTUDIANTE,
          estado: EstadoUsuario.PENDIENTE,
        },
      });

      const nroMatricula = `PEND-${usuario.id_usuario}`;

      const estudiante = await tx.estudiante.create({
        data: {
          id_usuario: usuario.id_usuario,
          id_tutor: tutor.id_tutor,
          nro_matricula: nroMatricula,
          fecha_nacimiento: fechaNacimiento,
          fecha_ingreso: new Date(),
        },
      });

      return {
        mensaje:
          'Postulante registrado correctamente. Su solicitud queda pendiente de aprobación.',
        postulante: {
          id_usuario: usuario.id_usuario,
          id_estudiante: estudiante.id_estudiante,
          email: usuario.email,
          rol: usuario.rol,
          estado: usuario.estado,
        },
      };
    });
  }
}