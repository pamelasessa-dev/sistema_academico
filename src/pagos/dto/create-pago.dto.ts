import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';
import { MetodoPago } from '../../generated/prisma/enums.js';

export class CreatePagoDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la obligación financiera que se desea pagar.',
  })
  @IsInt({
    message: 'El ID de la obligación debe ser un número entero',
  })
  @Min(1, {
    message: 'El ID de la obligación debe ser mayor o igual a 1',
  })
  id_obligacion: number;

  @ApiProperty({
    example: 5000,
    description: 'Monto del pago.',
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'El monto debe ser un número con hasta 2 decimales',
    },
  )
  @Min(0.01, {
    message: 'El monto debe ser mayor a 0',
  })
  monto: number;

  @ApiProperty({
    enum: MetodoPago,
    example: MetodoPago.TRANSFERENCIA,
    description: 'Método utilizado para realizar el pago.',
  })
  @IsEnum(MetodoPago, {
    message:
      'El método de pago debe ser EFECTIVO, TRANSFERENCIA o PASARELA',
  })
  metodo: MetodoPago;
}