import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class MockPayWebhookDto {
  @ApiProperty({
    example: 'payment.succeeded',
    description: 'Evento enviado por MockPay.',
    enum: ['payment.succeeded', 'payment.failed'],
  })
  @IsString()
  @IsIn(['payment.succeeded', 'payment.failed'])
  event: string;

  @ApiProperty({
    example: 'd640e69d-46b7-4d2b-ac32-9f8e85718060',
    description: 'ID de la transacción de MockPay.',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 120.5,
    description: 'Monto de la transacción.',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'USD',
    description: 'Moneda de la transacción.',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    example: 'SUCCEEDED',
    description: 'Estado final de la transacción.',
    enum: ['SUCCEEDED', 'FAILED'],
  })
  @IsString()
  @IsIn(['SUCCEEDED', 'FAILED'])
  status: string;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Motivo del fallo cuando el pago es rechazado.',
  })
  @IsOptional()
  @IsString()
  failure_reason?: string | null;

  @ApiProperty({
    example: {
      id_pago: '123',
      id_obligacion: '45',
    },
    description: 'Metadatos enviados originalmente al crear el pago.',
  })
  @IsObject()
  metadata: Record<string, string>;

  @ApiProperty({
    example: '2026-10-01T20:00:00.000Z',
    description: 'Fecha de creación de la transacción en MockPay.',
  })
  @IsString()
  created_at: string;
}