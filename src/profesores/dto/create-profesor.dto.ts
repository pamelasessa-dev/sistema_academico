import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateProfesorDto {
  @ApiProperty({
    description: 'Primer nombre del profesor.',
    example: 'Juan',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'El primer nombre debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El primer nombre es obligatorio',
  })
  @MinLength(2, {
    message: 'El primer nombre debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'El primer nombre no puede contener solo espacios',
  })
  primer_nombre: string;

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

  @ApiProperty({
    description: 'Primer apellido del profesor.',
    example: 'Pérez',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'El primer apellido debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El primer apellido es obligatorio',
  })
  @MinLength(2, {
    message: 'El primer apellido debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'El primer apellido no puede contener solo espacios',
  })
  primer_apellido: string;

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

  @ApiProperty({
    description: 'Correo electrónico del profesor.',
    example: 'juan.perez@sistemaacademico.com',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail(
    {},
    {
      message: 'El email debe tener un formato válido',
    },
  )
  @IsNotEmpty({
    message: 'El email es obligatorio',
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del profesor.',
    example: 'Profesor123!',
  })
  @IsString({
    message: 'La contraseña debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La contraseña es obligatoria',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  password: string;

  @ApiProperty({
    description: 'Especialidad del profesor.',
    example: 'Programación',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'La especialidad debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La especialidad es obligatoria',
  })
  @MinLength(2, {
    message: 'La especialidad debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'La especialidad no puede contener solo espacios',
  })
  especialidad: string;

  @ApiProperty({
    description: 'Fecha de contratación del profesor.',
    example: '2026-03-01',
  })
  @IsDateString(
    {},
    {
      message: 'La fecha de contratación debe ser una fecha válida',
    },
  )
  @IsNotEmpty({
    message: 'La fecha de contratación es obligatoria',
  })
  fecha_contratacion: string;
}