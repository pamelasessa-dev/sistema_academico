import { Module } from '@nestjs/common';

import { MateriasController } from './materias.controller.js';
import { MateriasService } from './materias.service.js';

@Module({
  controllers: [MateriasController],
  providers: [MateriasService],
})
export class MateriasModule {}