import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { TipoActividad } from '../../generated/prisma/enums.js';

export class CreateActividadDto {
  @ApiProperty({
    example: 1,
    description: 'ID del grupo al que pertenece la actividad.',
  })
  @IsInt({ message: 'El ID del grupo debe ser un número entero.' })
  @Min(1, { message: 'El ID del grupo debe ser mayor o igual a 1.' })
  id_grupo: number;

  @ApiProperty({
    example: 'Trabajo práctico 1',
    description: 'Título de la actividad.',
  })
  @IsString({ message: 'El título debe ser texto.' })
  @MinLength(2, {
    message: 'El título debe tener al menos 2 caracteres.',
  })
  titulo: string;

  @ApiPropertyOptional({
    example: 'Crear una aplicación web utilizando NestJS.',
    description: 'Descripción de la actividad.',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto.' })
  descripcion?: string;

  @ApiProperty({
    enum: TipoActividad,
    example: TipoActividad.TAREA,
    description: 'Tipo de actividad académica.',
  })
  @IsEnum(TipoActividad, {
    message: 'El tipo de actividad no es válido.',
  })
  tipo: TipoActividad;

  @ApiProperty({
    example: 100,
    description: 'Puntaje máximo de la actividad.',
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El puntaje máximo debe ser un número válido.' },
  )
  @Min(1, {
    message: 'El puntaje máximo debe ser mayor o igual a 1.',
  })
  puntaje_maximo: number;

  @ApiProperty({
    example: 20,
    description: 'Porcentaje que aporta la actividad a la calificación.',
  })
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
  porcentaje_aporte: number;

  @ApiProperty({
    example: '2026-10-01T18:00:00.000Z',
    description: 'Fecha y hora de apertura de la actividad.',
  })
  @IsDateString(
    {},
    { message: 'La fecha de apertura debe ser una fecha válida.' },
  )
  fecha_apertura: string;

  @ApiProperty({
    example: '2026-10-15T23:59:00.000Z',
    description: 'Fecha y hora de cierre de la actividad.',
  })
  @IsDateString(
    {},
    { message: 'La fecha de cierre debe ser una fecha válida.' },
  )
  fecha_cierre: string;
}