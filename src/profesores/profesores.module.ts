import { Module } from '@nestjs/common';
import { ProfesoresService } from './profesores.service.js';
import { ProfesoresController } from './profesores.controller.js';
//conecta, dice este módulo tiene este controller y este service
//s permite que Nest pueda hacer la inyección:
@Module({
  
  providers: [ProfesoresService],
  controllers: [ProfesoresController]
})
export class ProfesoresModule {}
