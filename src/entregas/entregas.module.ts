import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { EntregasController } from './entregas.controller.js';
import { EntregasService } from './entregas.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [EntregasController],
  providers: [EntregasService],
  exports: [EntregasService],
})
export class EntregasModule {}