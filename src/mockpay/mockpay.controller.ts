import {
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MockPayWebhookDto } from './dto/mockpay-webhook.dto.js';
import { MockPayService } from './mockpay.service.js';

@ApiTags('MockPay')
@Controller('pagos')
export class MockPayController {
  constructor(
    private readonly mockPayService: MockPayService,
  ) {}

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Recibir confirmación de pago de MockPay',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook recibido y procesado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Payload del webhook inválido.',
  })
  @ApiResponse({
    status: 404,
    description: 'No existe un pago asociado a la transacción.',
  })
  webhook(@Body() dto: MockPayWebhookDto) {
    return this.mockPayService.procesarWebhook(dto);
  }
}