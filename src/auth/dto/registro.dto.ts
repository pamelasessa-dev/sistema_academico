import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class RegistroDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Primer nombre del estudiante.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El primer nombre debe ser texto' })
  @IsNotEmpty({ message: 'El primer nombre es obligatorio' })
  primer_nombre!: string;

  @ApiPropertyOptional({
    example: 'Carlos',
    description: 'Segundo nombre del estudiante.',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El segundo nombre debe ser texto' })
  segundo_nombre?: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Primer apellido del estudiante.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El primer apellido debe ser texto' })
  @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
  primer_apellido!: string;

  @ApiPropertyOptional({
    example: 'Gómez',
    description: 'Segundo apellido del estudiante.',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El segundo apellido debe ser texto' })
  segundo_apellido?: string;

  @ApiProperty({
    example: 'estudiante@academico.test',
    description: 'Correo electrónico del estudiante.',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail(
    {},
    {
      message: 'El email debe tener un formato válido',
    },
  )
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña del estudiante.',
  })
  @IsString({ message: 'La contraseña debe ser texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  password!: string;

  @ApiPropertyOptional({
    example: '099123456',
    description: 'Teléfono del estudiante.',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El teléfono debe ser texto' })
  telefono?: string;

  @ApiProperty({
    example: '2010-05-15',
    description: 'Fecha de nacimiento del estudiante.',
  })
  @Type(() => Date)
  @IsDate(
    {
      message: 'La fecha de nacimiento debe tener un formato de fecha válido',
    },
  )
  fecha_nacimiento!: Date;

  @ApiPropertyOptional({
    example: 'Calle Principal 123',
    description: 'Dirección del estudiante.',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @ApiProperty({
    example: 'María',
    description: 'Nombre del tutor del estudiante.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El nombre del tutor debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del tutor es obligatorio' })
  tutor_nombre!: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del tutor del estudiante.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El apellido del tutor debe ser texto' })
  @IsNotEmpty({ message: 'El apellido del tutor es obligatorio' })
  tutor_apellido!: string;

  @ApiProperty({
    example: 'Madre',
    description: 'Parentesco del tutor con el estudiante.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El parentesco debe ser texto' })
  @IsNotEmpty({ message: 'El parentesco es obligatorio' })
  tutor_parentesco!: string;

  @ApiProperty({
    example: '099987654',
    description: 'Teléfono del tutor.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'El teléfono del tutor debe ser texto' })
  @IsNotEmpty({ message: 'El teléfono del tutor es obligatorio' })
  tutor_telefono!: string;

  @ApiPropertyOptional({
    example: 'maria.perez@example.com',
    description: 'Correo electrónico del tutor.',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail(
    {},
    {
      message: 'El email del tutor debe tener un formato válido',
    },
  )
  tutor_email?: string;

  @ApiPropertyOptional({
    example: 'Calle Principal 123',
    description: 'Dirección del tutor.',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString({ message: 'La dirección del tutor debe ser texto' })
  tutor_direccion?: string;
}