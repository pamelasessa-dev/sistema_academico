import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TutoresController } from './tutores.controller.js';
import { TutoresService } from './tutores.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [TutoresController],
  providers: [TutoresService],
  exports: [TutoresService],
})
export class TutoresModule {}