import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { envValidationSchema } from './config/env.validation.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { EstudiantesModule } from './estudiantes/estudiantes.module.js';
import { TutoresModule } from './tutores/tutores.module.js';
import { ProfesoresModule } from './profesores/profesores.module.js';
import { MateriasModule } from './materias/materias.module.js';
import { PeriodosModule } from './periodos/periodos.module.js';
import { AulasModule } from './aulas/aulas.module.js';
import { GruposModule } from './grupos/grupos.module.js';
import { HorariosModule } from './horarios/horarios.module.js';
import { MatriculasModule } from './matriculas/matriculas.module.js';
import { ActividadesModule } from './actividades/actividades.module.js';
import { EntregasModule } from './entregas/entregas.module.js';
import { ObligacionesModule } from './finanzas/obligaciones.module.js';
import { PagosModule } from './pagos/pagos.module.js';
import { AuditoriaModule } from './auditoria/auditoria.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        libraryOptions:{
        abortEarly: false,
        allowUnknown: true,
      },
    },
    }),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    EstudiantesModule,
    TutoresModule,
    ProfesoresModule,
    MateriasModule,
    PeriodosModule,
    AulasModule,
    GruposModule,
    HorariosModule,
    MatriculasModule,
    ActividadesModule,
    EntregasModule,
    ObligacionesModule,
    PagosModule,
    AuditoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}