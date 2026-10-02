import 'dotenv/config';

import bcrypt from 'bcryptjs';
import pg from 'pg';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('==========================================');
  console.log('INICIANDO SEED DE PRUEBAS');
  console.log('==========================================');

  // =====================================================
  // CONTRASEÑAS
  // =====================================================

  const adminPasswordHash = await bcrypt.hash('Admin123', 10);

  const recepcionistaPasswordHash = await bcrypt.hash('Recepcionista123', 10);

  const profesorPasswordHash = await bcrypt.hash('Profesor123', 10);

  const estudiantePasswordHash = await bcrypt.hash('Estudiante123', 10);

  // =====================================================
  // USUARIO ADMIN
  // =====================================================

  const admin = await prisma.usuario.create({
    data: {
      primer_nombre: 'Administrador',
      primer_apellido: 'Sistema',
      email: 'admin@sistemaacademico.com',
      password: adminPasswordHash,
      rol: 'ADMIN',
      estado: 'ACTIVO',
    },
  });

  // =====================================================
  // USUARIO RECEPCIONISTA
  // =====================================================

  const recepcionista = await prisma.usuario.create({
    data: {
      primer_nombre: 'Laura',
      primer_apellido: 'Rodríguez',
      email: 'recepcionista@sistemaacademico.com',
      password: recepcionistaPasswordHash,
      rol: 'RECEPCIONISTA',
      estado: 'ACTIVO',
    },
  });

  // =====================================================
  // USUARIO PROFESOR
  // =====================================================

  const profesorUsuario = await prisma.usuario.create({
    data: {
      primer_nombre: 'Juan',
      primer_apellido: 'Pérez',
      email: 'profesor@sistemaacademico.com',
      password: profesorPasswordHash,
      rol: 'PROFESOR',
      estado: 'ACTIVO',
    },
  });

  // =====================================================
  // PROFESOR
  // =====================================================

  const profesor = await prisma.profesor.create({
    data: {
      id_usuario: profesorUsuario.id_usuario,
      especialidad: 'Programación',
      fecha_contratacion: new Date('2026-03-01'),
    },
  });

  // =====================================================
  // TUTORES
  // =====================================================

  const tutor1 = await prisma.tutor.create({
    data: {
      nombre: 'Carlos',
      apellido: 'Gómez',
      parentesco: 'Padre',
      telefono: '099123456',
      email: 'carlos.gomez@example.com',
      direccion: 'Montevideo',
    },
  });

  const tutor2 = await prisma.tutor.create({
    data: {
      nombre: 'María',
      apellido: 'López',
      parentesco: 'Madre',
      telefono: '098654321',
      email: 'maria.lopez@example.com',
      direccion: 'Canelones',
    },
  });

  // =====================================================
  // USUARIO ESTUDIANTE 1
  // =====================================================

  const estudianteUsuario = await prisma.usuario.create({
    data: {
      primer_nombre: 'Ana',
      primer_apellido: 'García',
      email: 'estudiante@sistemaacademico.com',
      password: estudiantePasswordHash,
      rol: 'ESTUDIANTE',
      estado: 'ACTIVO',
    },
  });

  // =====================================================
  // ESTUDIANTE 1
  // =====================================================

  const estudiante = await prisma.estudiante.create({
    data: {
      id_usuario: estudianteUsuario.id_usuario,
      id_tutor: tutor1.id_tutor,
      nro_matricula: 'EST-2026-001',
      fecha_nacimiento: new Date('2005-05-15'),
      direccion: 'Montevideo',
      fecha_ingreso: new Date('2026-03-01'),
    },
  });

  // =====================================================
  // USUARIO ESTUDIANTE 2
  // =====================================================

  const estudiante2Usuario = await prisma.usuario.create({
    data: {
      primer_nombre: 'Luis',
      primer_apellido: 'Martínez',
      email: 'estudiante2@sistemaacademico.com',
      password: estudiantePasswordHash,
      rol: 'ESTUDIANTE',
      estado: 'ACTIVO',
    },
  });

  // =====================================================
  // ESTUDIANTE 2
  // =====================================================

  const estudiante2 = await prisma.estudiante.create({
    data: {
      id_usuario: estudiante2Usuario.id_usuario,
      id_tutor: tutor2.id_tutor,
      nro_matricula: 'EST-2026-002',
      fecha_nacimiento: new Date('2004-08-20'),
      direccion: 'Canelones',
      fecha_ingreso: new Date('2026-03-01'),
    },
  });

  // =====================================================
  // PERIODOS
  // =====================================================

  const periodoActivo = await prisma.periodo.create({
    data: {
      nombre: 'Segundo semestre 2026',
      fecha_inicio: new Date('2026-08-01'),
      fecha_fin: new Date('2026-12-20'),
      limite_creditos: 30,
      estado: 'ACTIVO',
    },
  });

  const periodoPlanificado = await prisma.periodo.create({
    data: {
      nombre: 'Primer semestre 2027',
      fecha_inicio: new Date('2027-03-01'),
      fecha_fin: new Date('2027-07-31'),
      limite_creditos: 30,
      estado: 'PLANIFICADO',
    },
  });

  const periodoFinalizado = await prisma.periodo.create({
    data: {
      nombre: 'Primer semestre 2026',
      fecha_inicio: new Date('2026-03-01'),
      fecha_fin: new Date('2026-07-31'),
      limite_creditos: 30,
      estado: 'FINALIZADO',
    },
  });

  // =====================================================
  // MATERIAS
  // =====================================================

  const materiaProgramacion = await prisma.materia.create({
    data: {
      nombre: 'Programación Web',
      descripcion: 'Introducción al desarrollo de aplicaciones web.',
      creditos: 5,
      costos_inscripcion: 5000,
      costo_mensual: 3500,
      estado: 'ACTIVA',
    },
  });

  const materiaBaseDatos = await prisma.materia.create({
    data: {
      nombre: 'Bases de Datos',
      descripcion: 'Fundamentos de bases de datos relacionales.',
      creditos: 5,
      costos_inscripcion: 5000,
      costo_mensual: 3500,
      estado: 'ACTIVA',
    },
  });

  const materiaInactiva = await prisma.materia.create({
    data: {
      nombre: 'Materia Inactiva de Prueba',
      descripcion: 'Materia utilizada para probar estados inactivos.',
      creditos: 4,
      costos_inscripcion: 4000,
      costo_mensual: 3000,
      estado: 'INACTIVA',
    },
  });

  // Evitar warning de variable no utilizada.
  void materiaInactiva;

  // =====================================================
  // AULAS
  // =====================================================

  const aulaFisica = await prisma.aula.create({
    data: {
      nombre: 'Laboratorio 1',
      capacidad: 30,
      ubicacion: 'Primer piso',
      tipo: 'FISICA',
      estado: 'DISPONIBLE',
    },
  });

  const aulaVirtual = await prisma.aula.create({
    data: {
      nombre: 'Aula Virtual 1',
      capacidad: 50,
      ubicacion: 'Plataforma virtual',
      tipo: 'VIRTUAL',
      estado: 'DISPONIBLE',
    },
  });

  const aulaNoDisponible = await prisma.aula.create({
    data: {
      nombre: 'Laboratorio 2',
      capacidad: 20,
      ubicacion: 'Segundo piso',
      tipo: 'FISICA',
      estado: 'NO_DISPONIBLE',
    },
  });

  void aulaNoDisponible;

  // =====================================================
  // GRUPO ABIERTO
  // =====================================================

  const grupoActivo = await prisma.grupo.create({
    data: {
      id_materia: materiaProgramacion.id_materia,
      id_periodo: periodoActivo.id_periodo,
      id_profesor: profesor.id_profesor,
      id_aula: aulaFisica.id_aula,
      nombre: 'Grupo A',
      cupo_maximo: 30,
      estado: 'ABIERTO',
    },
  });

  // =====================================================
  // GRUPO CERRADO
  // =====================================================

  const grupoCerrado = await prisma.grupo.create({
    data: {
      id_materia: materiaBaseDatos.id_materia,
      id_periodo: periodoActivo.id_periodo,
      id_profesor: profesor.id_profesor,
      id_aula: aulaVirtual.id_aula,
      nombre: 'Grupo B',
      cupo_maximo: 25,
      estado: 'CERRADO',
    },
  });

  // =====================================================
  // GRUPO FINALIZADO
  // =====================================================

  const grupoFinalizado = await prisma.grupo.create({
    data: {
      id_materia: materiaProgramacion.id_materia,
      id_periodo: periodoFinalizado.id_periodo,
      id_profesor: profesor.id_profesor,
      id_aula: aulaFisica.id_aula,
      nombre: 'Grupo C',
      cupo_maximo: 30,
      estado: 'FINALIZADO',
    },
  });

  // =====================================================
  // HORARIO
  // =====================================================

  const horario = await prisma.horario.create({
    data: {
      id_grupo: grupoActivo.id_grupo,
      dia_semana: 'LUNES',
      hora_inicio: new Date('1970-01-01T18:00:00'),
      hora_fin: new Date('1970-01-01T20:00:00'),
    },
  });

  void horario;

  // =====================================================
  // MATRÍCULA ANA - ACTIVA
  // =====================================================

  const matriculaAnaActiva = await prisma.matricula.create({
    data: {
      id_estudiante: estudiante.id_estudiante,
      id_grupo: grupoActivo.id_grupo,
      fecha_matricula: new Date('2026-08-05'),
      estado: 'ACTIVA',
    },
  });

  // =====================================================
  // MATRÍCULA ANA - PENDIENTE
  // =====================================================

  const matriculaAnaPendiente = await prisma.matricula.create({
    data: {
      id_estudiante: estudiante.id_estudiante,
      id_grupo: grupoCerrado.id_grupo,
      fecha_matricula: new Date('2026-08-10'),
      estado: 'PENDIENTE',
    },
  });

  // =====================================================
  // MATRÍCULA LUIS - FINALIZADA
  // =====================================================

  const matriculaLuisFinalizada = await prisma.matricula.create({
    data: {
      id_estudiante: estudiante2.id_estudiante,
      id_grupo: grupoFinalizado.id_grupo,
      fecha_matricula: new Date('2026-03-05'),
      estado: 'FINALIZADA',
    },
  });

  // =====================================================
  // MATRÍCULA LUIS - PENDIENTE
  // =====================================================
  // Esta se utilizará para probar el flujo:
  // matrícula pendiente → pago → verificación.

  const matriculaLuisPendiente = await prisma.matricula.create({
    data: {
      id_estudiante: estudiante2.id_estudiante,
      id_grupo: grupoCerrado.id_grupo,
      fecha_matricula: new Date('2026-09-01'),
      estado: 'PENDIENTE',
    },
  });

  // =====================================================
  // ACTIVIDAD ABIERTA
  // =====================================================

  const actividadAbierta = await prisma.actividadAcademica.create({
    data: {
      id_grupo: grupoActivo.id_grupo,
      titulo: 'Parcial 1 - Programación Web',
      descripcion: 'Evaluación sobre fundamentos de desarrollo web.',
      tipo: 'PARCIAL',
      puntaje_maximo: 100,
      porcentaje_aporte: 30,
      fecha_apertura: new Date('2026-09-01'),
      fecha_cierre: new Date('2026-12-01'),
      estado: 'ABIERTA',
    },
  });

  // =====================================================
  // ACTIVIDAD BORRADOR
  // =====================================================

  const actividadBorrador = await prisma.actividadAcademica.create({
    data: {
      id_grupo: grupoActivo.id_grupo,
      titulo: 'Proyecto Final',
      descripcion: 'Proyecto final de la asignatura.',
      tipo: 'PROYECTO',
      puntaje_maximo: 100,
      porcentaje_aporte: 40,
      fecha_apertura: new Date('2026-10-15'),
      fecha_cierre: new Date('2026-12-10'),
      estado: 'BORRADOR',
    },
  });

  void actividadBorrador;

  // =====================================================
  // ENTREGA ANA - CALIFICADA
  // =====================================================

  const entrega = await prisma.entrega.create({
    data: {
      id_actividad: actividadAbierta.id_actividad,
      id_matricula: matriculaAnaActiva.id_matricula,
      fecha_entrega: new Date('2026-09-20'),
      archivo_url: 'https://example.com/entrega-parcial-1.pdf',
      respuesta_texto: 'Entrega de prueba para validar el flujo académico.',
      puntaje_obtenido: 85,
      observacion_docente: 'Buen trabajo. Cumple con los requisitos.',
      estado: 'CALIFICADA',
    },
  });

  // =====================================================
  // OBLIGACIÓN ANA - PAGADA
  // =====================================================

  const obligacionPagada = await prisma.obligacionFinanciera.create({
    data: {
      id_estudiante: estudiante.id_estudiante,
      id_matricula: matriculaAnaActiva.id_matricula,
      concepto: 'INSCRIPCION',
      monto: 5000,
      fecha_emision: new Date('2026-08-05'),
      fecha_vencimiento: new Date('2026-08-15'),
      estado: 'PAGADA',
    },
  });

  // =====================================================
  // PAGO ANA - APROBADO
  // =====================================================

  const pagoAprobado = await prisma.pago.create({
    data: {
      id_obligacion: obligacionPagada.id_obligacion,
      id_usuario_verificador: recepcionista.id_usuario,
      monto: 5000,
      fecha_pago: new Date('2026-08-06'),
      metodo: 'TRANSFERENCIA',
      estado: 'APROBADO',
      fecha_validacion: new Date('2026-08-06'),
      observacion: 'Pago aprobado durante la carga inicial.',
    },
  });

  // =====================================================
  // OBLIGACIÓN ANA - PASARELA / MOCKPAY
  // =====================================================
  // IMPORTANTE:
  // No tiene ningún pago.
  //
  // Esta será la obligación utilizada para probar:
  //
  // POST /pagos
  // metodo: PASARELA
  //
  // Luego, con MockPay real:
  //
  // Pago PENDIENTE
  //       ↓
  // Webhook SUCCEEDED
  //       ↓
  // Pago APROBADO
  //       ↓
  // Obligación PAGADA

  const obligacionPasarela = await prisma.obligacionFinanciera.create({
    data: {
      id_estudiante: estudiante.id_estudiante,
      id_matricula: matriculaAnaActiva.id_matricula,
      concepto: 'MENSUALIDAD',
      monto: 3500,
      fecha_emision: new Date('2026-09-01'),
      fecha_vencimiento: new Date('2026-10-15'),
      estado: 'PENDIENTE',
    },
  });

  // =====================================================
  // OBLIGACIÓN ANA - VENCIDA
  // =====================================================

  const obligacionVencida = await prisma.obligacionFinanciera.create({
    data: {
      id_estudiante: estudiante.id_estudiante,
      id_matricula: matriculaAnaActiva.id_matricula,
      concepto: 'MENSUALIDAD',
      monto: 3500,
      fecha_emision: new Date('2026-07-01'),
      fecha_vencimiento: new Date('2026-07-31'),
      estado: 'VENCIDA',
    },
  });

  // =====================================================
  // OBLIGACIÓN ANA - CANCELADA
  // =====================================================

  const obligacionCancelada = await prisma.obligacionFinanciera.create({
    data: {
      id_estudiante: estudiante.id_estudiante,
      id_matricula: matriculaAnaPendiente.id_matricula,
      concepto: 'OTRO',
      monto: 1000,
      fecha_emision: new Date('2026-08-10'),
      fecha_vencimiento: new Date('2026-08-20'),
      estado: 'CANCELADA',
    },
  });

  // =====================================================
  // OBLIGACIÓN ANA - PENDIENTE
  // CON PAGO RECHAZADO
  // =====================================================

  const obligacionRechazada = await prisma.obligacionFinanciera.create({
    data: {
      id_estudiante: estudiante.id_estudiante,
      id_matricula: matriculaAnaActiva.id_matricula,
      concepto: 'OTRO',
      monto: 2000,
      fecha_emision: new Date('2026-09-15'),
      fecha_vencimiento: new Date('2026-10-30'),
      estado: 'PENDIENTE',
    },
  });

  const pagoRechazado = await prisma.pago.create({
    data: {
      id_obligacion: obligacionRechazada.id_obligacion,
      monto: 2000,
      fecha_pago: new Date('2026-09-20'),
      metodo: 'TRANSFERENCIA',
      estado: 'RECHAZADO',
      fecha_validacion: new Date('2026-09-20'),
      id_usuario_verificador: recepcionista.id_usuario,
      observacion: 'Comprobante de transferencia inválido.',
    },
  });

  // =====================================================
  // OBLIGACIÓN LUIS - PENDIENTE
  // =====================================================

  const obligacionLuis = await prisma.obligacionFinanciera.create({
    data: {
      id_estudiante: estudiante2.id_estudiante,
      id_matricula: matriculaLuisPendiente.id_matricula,
      concepto: 'INSCRIPCION',
      monto: 5000,
      fecha_emision: new Date('2026-09-01'),
      fecha_vencimiento: new Date('2026-10-30'),
      estado: 'PENDIENTE',
    },
  });

  // =====================================================
  // PAGO LUIS - PENDIENTE
  // =====================================================
  // Este pago sirve para probar desde Swagger:
  //
  // PATCH /pagos/:id/aprobar
  //
  // y:
  //
  // PATCH /pagos/:id/rechazar
  //
  // Al aprobarlo:
  //
  // Pago → APROBADO
  // Obligación → PAGADA

  const pagoPendiente = await prisma.pago.create({
    data: {
      id_obligacion: obligacionLuis.id_obligacion,
      monto: 5000,
      fecha_pago: new Date('2026-09-25'),
      metodo: 'TRANSFERENCIA',
      estado: 'PENDIENTE',
    },
  });

  // =====================================================
  // AUDITORÍA
  // =====================================================

  await prisma.auditoria.create({
    data: {
      id_usuario: recepcionista.id_usuario,
      entidad: 'Pago',
      id_registro: pagoAprobado.id_pago,
      accion: 'APROBAR',
      valor_anterior: {
        estado: 'PENDIENTE',
      },
      valor_nuevo: {
        estado: 'APROBADO',
      },
      detalle: 'Registro creado por el seed de pruebas.',
    },
  });

  // =====================================================
  // RESUMEN
  // =====================================================

  console.log('');
  console.log('==========================================');
  console.log('SEED COMPLETADO CORRECTAMENTE');
  console.log('==========================================');

  console.log('');
  console.log('USUARIOS PARA PRUEBAS:');

  console.log('ADMIN:', admin.email, '| contraseña: Admin123');

  console.log(
    'RECEPCIONISTA:',
    recepcionista.email,
    '| contraseña: Recepcionista123',
  );

  console.log('PROFESOR:', profesorUsuario.email, '| contraseña: Profesor123');

  console.log(
    'ESTUDIANTE 1:',
    estudianteUsuario.email,
    '| contraseña: Estudiante123',
  );

  console.log(
    'ESTUDIANTE 2:',
    estudiante2Usuario.email,
    '| contraseña: Estudiante123',
  );

  console.log('');
  console.log('DATOS IMPORTANTES:');

  console.log({
    estudiante1: estudiante.id_estudiante,
    estudiante2: estudiante2.id_estudiante,

    matriculaAnaActiva: matriculaAnaActiva.id_matricula,

    matriculaAnaPendiente: matriculaAnaPendiente.id_matricula,

    matriculaLuisFinalizada: matriculaLuisFinalizada.id_matricula,

    matriculaLuisPendiente: matriculaLuisPendiente.id_matricula,

    obligacionPagada: obligacionPagada.id_obligacion,

    obligacionPasarela: obligacionPasarela.id_obligacion,

    obligacionVencida: obligacionVencida.id_obligacion,

    obligacionCancelada: obligacionCancelada.id_obligacion,

    obligacionRechazada: obligacionRechazada.id_obligacion,

    obligacionLuis: obligacionLuis.id_obligacion,

    pagoAprobado: pagoAprobado.id_pago,

    pagoRechazado: pagoRechazado.id_pago,

    pagoPendiente: pagoPendiente.id_pago,

    actividad: actividadAbierta.id_actividad,

    entrega: entrega.id_entrega,

    grupoActivo: grupoActivo.id_grupo,

    grupoCerrado: grupoCerrado.id_grupo,

    grupoFinalizado: grupoFinalizado.id_grupo,

    periodoActivo: periodoActivo.id_periodo,

    periodoPlanificado: periodoPlanificado.id_periodo,

    periodoFinalizado: periodoFinalizado.id_periodo,
  });
}

main()
  .catch((error) => {
    console.error('');
    console.error('ERROR EJECUTANDO EL SEED:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
