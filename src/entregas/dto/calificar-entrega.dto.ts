import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CalificarEntregaDto {
  @ApiProperty({
    example: 85,
    description: 'Puntaje obtenido por el estudiante.',
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El puntaje obtenido debe ser un número válido.' },
  )
  @Min(0, {
    message: 'El puntaje obtenido no puede ser negativo.',
  })
  puntaje_obtenido: number;

  @ApiPropertyOptional({
    example: 'Muy buen trabajo.',
    description: 'Observación realizada por el docente.',
  })
  @IsOptional()
  @IsString({
    message: 'La observación debe ser texto.',
  })
  @MinLength(2, {
    message: 'La observación debe tener al menos 2 caracteres.',
  })
  observacion_docente?: string;
}