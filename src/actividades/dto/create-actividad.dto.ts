import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TipoActividad } from '../../generated/prisma/enums.js';

export class CreateActividadDto {
  @ApiProperty({
    example: 1,
    description: 'ID del grupo al que pertenece la actividad.',
  })
  @IsNumber()
  @Min(1)
  id_grupo: number;

  @ApiProperty({
    example: 'Trabajo práctico 1',
    description: 'Título de la actividad.',
  })
  @IsString()
  titulo: string;

  @ApiPropertyOptional({
    example: 'Crear una aplicación web utilizando NestJS.',
    description: 'Descripción de la actividad.',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    enum: TipoActividad,
    example: TipoActividad.TAREA,
    description: 'Tipo de actividad académica.',
  })
  @IsEnum(TipoActividad)
  tipo: TipoActividad;

  @ApiProperty({
    example: 100,
    description: 'Puntaje máximo de la actividad.',
  })
  @IsNumber()
  @Min(1)
  puntaje_maximo: number;

  @ApiProperty({
    example: 20,
    description: 'Porcentaje que aporta la actividad a la calificación.',
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  porcentaje_aporte: number;

  @ApiProperty({
    example: '2026-10-01T18:00:00.000Z',
    description: 'Fecha y hora de apertura de la actividad.',
  })
  @IsDateString()
  fecha_apertura: string;

  @ApiProperty({
    example: '2026-10-15T23:59:00.000Z',
    description: 'Fecha y hora de cierre de la actividad.',
  })
  @IsDateString()
  fecha_cierre: string;
}