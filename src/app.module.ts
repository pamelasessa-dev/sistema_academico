import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { envValidationSchema } from './config/env.validation.js';
import { PrismaService } from './prisma/prisma.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProfesoresModule } from './profesores/profesores.module.js';
import { AulasModule } from './aulas/aulas.module.js';
import { MateriasModule } from './materias/materias.module.js';
import { PeriodosModule } from './periodos/periodos.module.js';
import { HorariosModule } from './horarios/horarios.module.js';
import { GruposModule } from './grupos/grupos.module.js';
import { MatriculasModule } from './matriculas/matriculas.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        libraryOptions: {
          allowUnknown: true,
          abortEarly: false,
        },
      },
    }),

    AuthModule,
    PrismaModule,
    ProfesoresModule,
    AulasModule,
    MateriasModule,
    PeriodosModule,
    HorariosModule,
    GruposModule,
    MatriculasModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}