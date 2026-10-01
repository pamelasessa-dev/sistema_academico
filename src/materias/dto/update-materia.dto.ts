import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoMateria } from '../../generated/prisma/enums.js';

export class UpdateMateriaDto {
  @ApiPropertyOptional({
    description: 'Nombre de la materia.',
    example: 'Programación I',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  @MinLength(2, {
    message: 'El nombre debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'El nombre no puede contener solo espacios',
  })
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Descripción de la materia.',
    example:
      'Introducción a los fundamentos de programación y resolución de problemas.',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'La descripción debe ser una cadena de texto',
  })
  @Matches(/\S/, {
    message: 'La descripción no puede contener solo espacios',
  })
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Cantidad de créditos de la materia.',
    example: 6,
  })
  @IsOptional()
  @IsInt({
    message: 'Los créditos deben ser un número entero',
  })
  @Min(1, {
    message: 'Los créditos deben ser mayores o iguales a 1',
  })
  creditos?: number;

  @ApiPropertyOptional({
    description: 'Costo de inscripción de la materia.',
    example: 2500.0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El costo de inscripción debe ser un número con hasta 2 decimales',
    },
  )
  @Min(0, {
    message: 'El costo de inscripción no puede ser negativo',
  })
  costos_inscripcion?: number;

  @ApiPropertyOptional({
    description: 'Costo mensual de la materia.',
    example: 1800.0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El costo mensual debe ser un número con hasta 2 decimales',
    },
  )
  @Min(0, {
    message: 'El costo mensual no puede ser negativo',
  })
  costo_mensual?: number;

  @ApiPropertyOptional({
    description: 'Estado de la materia.',
    enum: EstadoMateria,
    example: EstadoMateria.ACTIVA,
  })
  @IsOptional()
  @IsEnum(EstadoMateria, {
    message: 'El estado debe ser ACTIVA o INACTIVA',
  })
  estado?: EstadoMateria;
}