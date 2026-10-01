import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CalificarEntregaDto {
  @ApiProperty({
    example: 85,
    description: 'Puntaje obtenido por el estudiante.',
  })
  @IsNumber()
  @Min(0)
  puntaje_obtenido: number;

  @ApiPropertyOptional({
    example: 'Muy buen trabajo.',
    description: 'Observación realizada por el docente.',
  })
  @IsOptional()
  @IsString()
  observacion_docente?: string;
}