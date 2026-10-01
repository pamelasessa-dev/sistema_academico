import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'estudiante@academico.test',
    description: 'Correo electrónico del usuario.',
  })
  @IsEmail(
    {},
    {
      message: 'El email debe tener un formato válido',
    },
  )
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña del usuario.',
  })
  @IsString({
    message: 'La contraseña debe ser texto',
  })
  @IsNotEmpty({
    message: 'La contraseña es obligatoria',
  })
  @MinLength(8, {
    message: 'La contraseña debe tener al menos 8 caracteres',
  })
  password!: string;
}