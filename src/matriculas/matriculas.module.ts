import { Module } from '@nestjs/common';

import { ObligacionesModule } from '../finanzas/obligaciones.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

import { MatriculasController } from './matriculas.controller.js';
import { MatriculasService } from './matriculas.service.js';

@Module({
  imports: [
    PrismaModule,
    ObligacionesModule,
  ],
  controllers: [MatriculasController],
  providers: [MatriculasService],
  exports: [MatriculasService],
})
export class MatriculasModule {}