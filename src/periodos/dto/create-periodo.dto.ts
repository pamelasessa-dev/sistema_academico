import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

import { Transform } from 'class-transformer';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { EstadoPeriodo } from '../../generated/prisma/enums.js';

export class CreatePeriodoDto {
  @ApiProperty({
    description: 'Nombre del período académico.',
    example: 'Primer semestre 2026',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El nombre es obligatorio',
  })
  @MinLength(2, {
    message: 'El nombre debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'El nombre no puede contener solo espacios',
  })
  nombre: string;

  @ApiProperty({
    description: 'Fecha de inicio del período académico.',
    example: '2026-03-01',
  })
  @IsDateString(
    {},
    {
      message: 'La fecha de inicio debe ser una fecha válida',
    },
  )
  @IsNotEmpty({
    message: 'La fecha de inicio es obligatoria',
  })
  fecha_inicio: string;

  @ApiProperty({
    description: 'Fecha de finalización del período académico.',
    example: '2026-07-31',
  })
  @IsDateString(
    {},
    {
      message: 'La fecha de finalización debe ser una fecha válida',
    },
  )
  @IsNotEmpty({
    message: 'La fecha de finalización es obligatoria',
  })
  fecha_fin: string;

  @ApiProperty({
    description:
      'Cantidad máxima de créditos que puede cursar un estudiante durante el período.',
    example: 24,
  })
  @IsInt({
    message: 'El límite de créditos debe ser un número entero',
  })
  @Min(1, {
    message: 'El límite de créditos debe ser mayor o igual a 1',
  })
  limite_creditos: number;

  @ApiPropertyOptional({
    description: 'Estado actual del período.',
    enum: EstadoPeriodo,
    example: EstadoPeriodo.PLANIFICADO,
  })
  @IsOptional()
  @IsEnum(EstadoPeriodo, {
    message:
      'El estado debe ser PLANIFICADO, ACTIVO o FINALIZADO',
  })
  estado?: EstadoPeriodo;
}