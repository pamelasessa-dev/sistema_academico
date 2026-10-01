import { Module } from '@nestjs/common';

import { AulasController } from './aulas.controller.js';
import { AulasService } from './aulas.service.js';

@Module({
  controllers: [AulasController],
  providers: [AulasService],
})
export class AulasModule {}