import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEntregaDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la actividad.',
  })
  @IsInt({
    message: 'El ID de la actividad debe ser un número entero.',
  })
  @Min(1, {
    message: 'El ID de la actividad debe ser mayor o igual a 1.',
  })
  id_actividad: number;

  @ApiPropertyOptional({
    example: 'https://ejemplo.com/trabajo.pdf',
    description: 'URL del archivo entregado.',
  })
  @IsOptional()
  @IsUrl(
    {},
    { message: 'La URL del archivo no es válida.' },
  )
  archivo_url?: string;

  @ApiPropertyOptional({
    example: 'Esta es mi resolución del trabajo.',
    description: 'Respuesta escrita del estudiante.',
  })
  @IsOptional()
  @IsString({
    message: 'La respuesta debe ser texto.',
  })
  @MinLength(1, {
    message: 'La respuesta no puede estar vacía.',
  })
  respuesta_texto?: string;
}