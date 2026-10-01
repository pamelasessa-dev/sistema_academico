import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoActividad } from '../../generated/prisma/enums.js';

export class UpdateEstadoActividadDto {
  @ApiProperty({
    enum: EstadoActividad,
    example: EstadoActividad.ABIERTA,
    description: 'Nuevo estado de la actividad.',
  })
  @IsEnum(EstadoActividad)
  estado: EstadoActividad;
}