import { Module } from '@nestjs/common';

import { AuditoriaModule } from '../auditoria/auditoria.module.js';
import { MockPayModule } from '../mockpay/mockpay.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

import { PagosController } from './pagos.controller.js';
import { PagosService } from './pagos.service.js';

@Module({
  imports: [
    PrismaModule,
    AuditoriaModule,
    MockPayModule,
  ],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}