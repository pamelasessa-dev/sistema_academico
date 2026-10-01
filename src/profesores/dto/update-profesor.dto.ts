import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfesorDto {
  @ApiPropertyOptional({
    description: 'Primer nombre del profesor.',
    example: 'Juan',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'El primer nombre debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El primer nombre no puede estar vacío',
  })
  @MinLength(2, {
    message: 'El primer nombre debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'El primer nombre no puede contener solo espacios',
  })
  primer_nombre?: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre del profesor.',
    example: 'Carlos',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'El segundo nombre debe ser una cadena de texto',
  })
  @MinLength(2, {
    message: 'El segundo nombre debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'El segundo nombre no puede contener solo espacios',
  })
  segundo_nombre?: string;

  @ApiPropertyOptional({
    description: 'Primer apellido del profesor.',
    example: 'Pérez',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'El primer apellido debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El primer apellido no puede estar vacío',
  })
  @MinLength(2, {
    message: 'El primer apellido debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'El primer apellido no puede contener solo espacios',
  })
  primer_apellido?: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del profesor.',
    example: 'Gómez',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'El segundo apellido debe ser una cadena de texto',
  })
  @MinLength(2, {
    message: 'El segundo apellido debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'El segundo apellido no puede contener solo espacios',
  })
  segundo_apellido?: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del profesor.',
    example: 'juan.perez@sistemaacademico.com',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail(
    {},
    {
      message: 'El email debe tener un formato válido',
    },
  )
  email?: string;

  @ApiPropertyOptional({
    description: 'Especialidad del profesor.',
    example: 'Programación',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'La especialidad debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La especialidad no puede estar vacía',
  })
  @MinLength(2, {
    message: 'La especialidad debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'La especialidad no puede contener solo espacios',
  })
  especialidad?: string;

  @ApiPropertyOptional({
    description: 'Fecha de contratación del profesor.',
    example: '2026-10-01',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'La fecha de contratación debe ser una fecha válida',
    },
  )
  fecha_contratacion?: string;
}
