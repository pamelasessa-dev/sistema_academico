import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class ChangeOwnPasswordDto {
  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña actual del usuario.',
  })
  @IsString({
    message: 'La contraseña actual debe ser texto',
  })
  @IsNotEmpty({
    message: 'La contraseña actual es obligatoria',
  })
  currentPassword!: string;

  @ApiProperty({
    example: 'NuevaPassword123!',
    description:
      'Nueva contraseña de al menos 8 caracteres.',
    minLength: 8,
  })
  @IsString({
    message: 'La nueva contraseña debe ser texto',
  })
  @IsNotEmpty({
    message: 'La nueva contraseña es obligatoria',
  })
  @MinLength(8, {
    message:
      'La nueva contraseña debe tener al menos 8 caracteres',
  })
  newPassword!: string;
}