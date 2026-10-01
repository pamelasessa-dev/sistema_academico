import { ApiPropertyOptional } from '@nestjs/swagger';
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

export class UpdateActividadDto {
  @ApiPropertyOptional({
    example: 'Trabajo práctico actualizado',
    description: 'Nuevo título de la actividad.',
  })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional({
    example: 'Nueva descripción',
    description: 'Nueva descripción de la actividad.',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    enum: TipoActividad,
    example: TipoActividad.TAREA,
    description: 'Nuevo tipo de actividad.',
  })
  @IsOptional()
  @IsEnum(TipoActividad)
  tipo?: TipoActividad;

  @ApiPropertyOptional({
    example: 100,
    description: 'Nuevo puntaje máximo de la actividad.',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  puntaje_maximo?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Nuevo porcentaje que aporta la actividad.',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  porcentaje_aporte?: number;

  @ApiPropertyOptional({
    example: '2026-10-01T18:00:00.000Z',
    description: 'Nueva fecha y hora de apertura.',
  })
  @IsOptional()
  @IsDateString()
  fecha_apertura?: string;

  @ApiPropertyOptional({
    example: '2026-10-15T23:59:00.000Z',
    description: 'Nueva fecha y hora de cierre.',
  })
  @IsOptional()
  @IsDateString()
  fecha_cierre?: string;
}