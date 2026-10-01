import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RechazarPagoDto {
  @ApiProperty({
    example: 'Comprobante ilegible',
    description: 'Motivo por el cual se rechaza el pago.',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'La observación debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La observación es obligatoria',
  })
  @MinLength(5, {
    message: 'La observación debe tener al menos 5 caracteres',
  })
  observacion: string;
}