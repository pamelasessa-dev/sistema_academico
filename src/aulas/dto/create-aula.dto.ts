import {
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

import {
  EstadoAula,
  TipoAula,
} from '../../generated/prisma/enums.js';

export class CreateAulaDto {
  @ApiProperty({
    description: 'Nombre o identificador del aula.',
    example: 'Aula 101',
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
    description: 'Capacidad máxima del aula.',
    example: 30,
  })
  @IsInt({
    message: 'La capacidad debe ser un número entero',
  })
  @Min(1, {
    message: 'La capacidad debe ser como mínimo 1',
  })
  capacidad: number;

  @ApiPropertyOptional({
    description: 'Ubicación física del aula.',
    example: 'Edificio A - Primer piso',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'La ubicación debe ser una cadena de texto',
  })
  @MinLength(2, {
    message: 'La ubicación debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'La ubicación no puede contener solo espacios',
  })
  ubicacion?: string;

  @ApiProperty({
    description: 'Tipo de aula.',
    enum: TipoAula,
    example: TipoAula.FISICA,
  })
  @IsEnum(TipoAula, {
    message: 'El tipo de aula no es válido',
  })
  tipo: TipoAula;

  @ApiPropertyOptional({
    description: 'Estado del aula.',
    enum: EstadoAula,
    example: EstadoAula.DISPONIBLE,
    default: EstadoAula.DISPONIBLE,
  })
  @IsOptional()
  @IsEnum(EstadoAula, {
    message: 'El estado del aula no es válido',
  })
  estado?: EstadoAula;
}