import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ProfesoresService } from './profesores.service.js';
import { ProfesoresController } from './profesores.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [ProfesoresService],
  controllers: [ProfesoresController],
  exports: [ProfesoresService],
})
export class ProfesoresModule {}