import { Transform } from 'class-transformer';
import {
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
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  primer_nombre: string;

  @ApiPropertyOptional({
    example: 'Carlos',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  segundo_nombre?: string;

  @ApiProperty({
    example: 'Pérez',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  primer_apellido: string;

  @ApiPropertyOptional({
    example: 'Gómez',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  segundo_apellido?: string;

  @ApiProperty({
    example: 'estudiante@academico.test',
  })
  @Transform(({ value }) => value?.trim().toLowerCase())
  @IsEmail(
    {},
    {
      message: 'El email debe tener un formato válido',
    },
  )
  email: string;

  @ApiProperty({
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  password: string;

  @ApiPropertyOptional({
    example: '099123456',
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  telefono?: string;

  @ApiProperty({
    example: 'María',
    description: 'Nombre del tutor del estudiante.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  tutor_nombre: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del tutor del estudiante.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  tutor_apellido: string;

  @ApiProperty({
    example: 'Madre',
    description: 'Parentesco del tutor con el estudiante.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  tutor_parentesco: string;

  @ApiProperty({
    example: '099987654',
    description: 'Teléfono del tutor.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  tutor_telefono: string;

  @ApiPropertyOptional({
    example: 'maria.perez@example.com',
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
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  tutor_direccion?: string;
}