import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuditoriaService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(data: {
    id_usuario: number;
    entidad: string;
    id_registro: number;
    accion: string;
    valor_anterior?: object;
    valor_nuevo?: object;
    detalle?: string;
  }) {
    return this.prisma.auditoria.create({
      data: {
        id_usuario: data.id_usuario,
        entidad: data.entidad,
        id_registro: data.id_registro,
        accion: data.accion,
        valor_anterior: data.valor_anterior,
        valor_nuevo: data.valor_nuevo,
        detalle: data.detalle,
      },
    });
  }
}