import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ObligacionesController } from './obligaciones.controller.js';
import { ObligacionesService } from './obligaciones.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [ObligacionesController],
  providers: [ObligacionesService],
  exports: [ObligacionesService],
})
export class ObligacionesModule {}