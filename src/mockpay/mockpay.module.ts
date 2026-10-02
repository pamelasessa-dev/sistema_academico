import { Module } from '@nestjs/common';

import { MockPayController } from './mockpay.controller.js';
import { MockPayService } from './mockpay.service.js';

@Module({
  controllers: [MockPayController],
  providers: [MockPayService],
  exports: [MockPayService],
})
export class MockPayModule {}
