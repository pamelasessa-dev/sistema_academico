import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { TipoActividad } from '../../generated/prisma/enums.js';

export class UpdateActividadDto {
  @ApiPropertyOptional({
    example: 'Trabajo práctico actualizado',
    description: 'Nuevo título de la actividad.',
  })
  @IsOptional()
  @IsString({ message: 'El título debe ser texto.' })
  @MinLength(2, {
    message: 'El título debe tener al menos 2 caracteres.',
  })
  titulo?: string;

  @ApiPropertyOptional({
    example: 'Nueva descripción',
    description: 'Nueva descripción de la actividad.',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto.' })
  descripcion?: string;

  @ApiPropertyOptional({
    enum: TipoActividad,
    example: TipoActividad.TAREA,
    description: 'Nuevo tipo de actividad.',
  })
  @IsOptional()
  @IsEnum(TipoActividad, {
    message: 'El tipo de actividad no es válido.',
  })
  tipo?: TipoActividad;

  @ApiPropertyOptional({
    example: 100,
    description: 'Nuevo puntaje máximo de la actividad.',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El puntaje máximo debe ser un número válido.' },
  )
  @Min(1, {
    message: 'El puntaje máximo debe ser mayor o igual a 1.',
  })
  puntaje_maximo?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Nuevo porcentaje que aporta la actividad.',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El porcentaje debe ser un número válido.' },
  )
  @Min(1, {
    message: 'El porcentaje debe ser mayor o igual a 1.',
  })
  @Max(100, {
    message: 'El porcentaje no puede superar 100.',
  })
  porcentaje_aporte?: number;

  @ApiPropertyOptional({
    example: '2026-10-01T18:00:00.000Z',
    description: 'Nueva fecha y hora de apertura.',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de apertura debe ser una fecha válida.' },
  )
  fecha_apertura?: string;

  @ApiPropertyOptional({
    example: '2026-10-15T23:59:00.000Z',
    description: 'Nueva fecha y hora de cierre.',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de cierre debe ser una fecha válida.' },
  )
  fecha_cierre?: string;
}