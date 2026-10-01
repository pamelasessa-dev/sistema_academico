import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AulasController } from './aulas.controller.js';
import { AulasService } from './aulas.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [AulasController],
  providers: [AulasService],
  exports: [AulasService],
})
export class AulasModule {}