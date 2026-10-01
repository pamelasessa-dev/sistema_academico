import { Module } from '@nestjs/common';
import { MatriculasController } from './matriculas.controller.js';
import { MatriculasService } from './matriculas.service.js';

@Module({
  controllers: [MatriculasController],
  providers: [MatriculasService],
})
export class MatriculasModule {}