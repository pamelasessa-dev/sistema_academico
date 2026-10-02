import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { EstadoObligacion, EstadoPago } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MockPayWebhookDto } from './dto/mockpay-webhook.dto.js';

@Injectable()
export class MockPayService {
  private readonly baseUrl =
    process.env.MOCKPAY_BASE_URL ??
    'https://mockpay-backend.onrender.com';

  private readonly secretKey = process.env.MOCKPAY_SECRET_KEY;

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async crearIntencionPago(data: {
    amount: number;
    currency: string;
    metadata: Record<string, string>;
  }) {
    if (!this.secretKey) {
      throw new InternalServerErrorException(
        'MOCKPAY_SECRET_KEY no está configurada',
      );
    }

    const response = await fetch(
      `${this.baseUrl}/api/v1/payments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount,
          currency: data.currency,
          metadata: data.metadata,
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();

      throw new BadRequestException(
        `MockPay rechazó la creación del pago: ${errorBody}`,
      );
    }

    return response.json() as Promise<{
      id_transaccion: string;
      checkout_url: string;
    }>;
  }

  async procesarWebhook(dto: MockPayWebhookDto) {
    const pago = await this.prisma.pago.findUnique({
      where: {
        id_mockpay: dto.id,
      },
      include: {
        obligacion: true,
      },
    });

    if (!pago) {
      throw new NotFoundException(
        'No existe un pago asociado a la transacción de MockPay',
      );
    }

    // Evitar procesar nuevamente un pago ya procesado.
    if (pago.estado !== EstadoPago.PENDIENTE) {
      return {
        message: 'El pago ya fue procesado',
      };
    }

    // Pago exitoso
    if (dto.event === 'payment.succeeded') {
      return this.prisma.$transaction(async (tx) => {
        const pagoActualizado = await tx.pago.update({
          where: {
            id_pago: pago.id_pago,
          },
          data: {
            estado: EstadoPago.APROBADO,
            fecha_validacion: new Date(),
            observacion:
              'Pago confirmado por MockPay mediante webhook.',
          },
        });

        const pagosAprobados =
          await tx.pago.aggregate({
            where: {
              id_obligacion: pago.id_obligacion,
              estado: EstadoPago.APROBADO,
            },
            _sum: {
              monto: true,
            },
          });

        const totalPagado = Number(
          pagosAprobados._sum.monto ?? 0,
        );

        if (
          totalPagado >=
          Number(pago.obligacion.monto)
        ) {
          await tx.obligacionFinanciera.update({
            where: {
              id_obligacion: pago.id_obligacion,
            },
            data: {
              estado: EstadoObligacion.PAGADA,
            },
          });
        }

        return pagoActualizado;
      });
    }

    // Pago rechazado
    if (dto.event === 'payment.failed') {
      return this.prisma.pago.update({
        where: {
          id_pago: pago.id_pago,
        },
        data: {
          estado: EstadoPago.RECHAZADO,
          fecha_validacion: new Date(),
          observacion:
            dto.failure_reason ??
            'Pago rechazado por MockPay.',
        },
      });
    }

    throw new BadRequestException(
      'Evento de MockPay no reconocido',
    );
  }
}