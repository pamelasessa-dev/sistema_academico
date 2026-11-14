import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateOwnProfileDto {
  @ApiPropertyOptional({
    example: 'María',
    description: 'Primer nombre del usuario.',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  primer_nombre?: string;

  @ApiPropertyOptional({
    example: 'José',
    description: 'Segundo nombre del usuario.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  segundo_nombre?: string | null;

  @ApiPropertyOptional({
    example: 'González',
    description: 'Primer apellido del usuario.',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  primer_apellido?: string;

  @ApiPropertyOptional({
    example: 'Pérez',
    description: 'Segundo apellido del usuario.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  segundo_apellido?: string | null;

  @ApiPropertyOptional({
    example: '099123456',
    description: 'Teléfono de contacto.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string | null;
}
