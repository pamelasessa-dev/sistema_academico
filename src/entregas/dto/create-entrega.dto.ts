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
} from 'class-validator';

export class CreateEntregaDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la actividad.',
  })
  @IsInt()
  @Min(1)
  id_actividad: number;

  @ApiPropertyOptional({
    example: 'https://ejemplo.com/trabajo.pdf',
    description: 'URL del archivo entregado.',
  })
  @IsOptional()
  @IsUrl()
  archivo_url?: string;

  @ApiPropertyOptional({
    example: 'Esta es mi resolución del trabajo.',
    description: 'Respuesta escrita del estudiante.',
  })
  @IsOptional()
  @IsString()
  respuesta_texto?: string;
}