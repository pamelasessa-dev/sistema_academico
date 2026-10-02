import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RechazarPagoDto {
  @ApiProperty({
    example: 'Comprobante ilegible',
    description:
      'Motivo por el cual se rechaza el pago.',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({
    message: 'La observación debe ser una cadena de texto.',
  })
  @IsNotEmpty({
    message: 'La observación es obligatoria.',
  })
  @MinLength(5, {
    message:
      'La observación debe tener al menos 5 caracteres.',
  })
  observacion: string;
}