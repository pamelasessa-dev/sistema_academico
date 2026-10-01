import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Iniciando seed...");

  // =====================================================
  //  CONTRASEÑAS
  // =====================================================

  const adminPasswordHash = await bcrypt.hash("Admin123", 10);
  const profesorPasswordHash = await bcrypt.hash("Profesor123", 10);
  const estudiantePasswordHash = await bcrypt.hash("Estudiante123", 10);

  // =====================================================
  //  USUARIO ADMIN
  // =====================================================

  const admin = await prisma.usuario.upsert({
    where: {
      email: "admin@sistemaacademico.com",
    },
    update: {},
    create: {
      primer_nombre: "Administrador",
      primer_apellido: "Sistema",
      email: "admin@sistemaacademico.com",
      password: adminPasswordHash,
      rol: "ADMIN",
      estado: "ACTIVO",
    },
  });

  // =====================================================
  //  USUARIO PROFESOR
  // =====================================================

  const profesorUsuario = await prisma.usuario.upsert({
    where: {
      email: "profesor@sistemaacademico.com",
    },
    update: {},
    create: {
      primer_nombre: "Juan",
      primer_apellido: "Pérez",
      email: "profesor@sistemaacademico.com",
      password: profesorPasswordHash,
      rol: "PROFESOR",
      estado: "ACTIVO",
    },
  });

  // =====================================================
  //  PROFESOR
  // =====================================================

  const profesor = await prisma.profesor.upsert({
    where: {
      id_usuario: profesorUsuario.id_usuario,
    },
    update: {},
    create: {
      id_usuario: profesorUsuario.id_usuario,
      especialidad: "Programación",
      fecha_contratacion: new Date("2026-03-01"),
    },
  });

  // =====================================================
  //  TUTOR
  // =====================================================

  const tutorExistente = await prisma.tutor.findFirst({
    where: {
      email: "carlos.gomez@example.com",
    },
  });

  const tutor =
    tutorExistente ??
    (await prisma.tutor.create({
      data: {
        nombre: "Carlos",
        apellido: "Gómez",
        parentesco: "Padre",
        telefono: "099123456",
        email: "carlos.gomez@example.com",
        direccion: "Montevideo",
      },
    }));

  // =====================================================
  //  USUARIO ESTUDIANTE
  // =====================================================

  const estudianteUsuario = await prisma.usuario.upsert({
    where: {
      email: "estudiante@sistemaacademico.com",
    },
    update: {},
    create: {
      primer_nombre: "Ana",
      primer_apellido: "García",
      email: "estudiante@sistemaacademico.com",
      password: estudiantePasswordHash,
      rol: "ESTUDIANTE",
      estado: "ACTIVO",
    },
  });

  // =====================================================
  //  ESTUDIANTE
  // =====================================================

  const estudianteExistente = await prisma.estudiante.findUnique({
    where: {
      id_usuario: estudianteUsuario.id_usuario,
    },
  });

  const estudiante =
    estudianteExistente ??
    (await prisma.estudiante.create({
      data: {
        id_usuario: estudianteUsuario.id_usuario,
        id_tutor: tutor.id_tutor,
        nro_matricula: "EST-2026-001",
        fecha_nacimiento: new Date("2005-05-15"),
        direccion: "Montevideo",
        fecha_ingreso: new Date("2026-03-01"),
      },
    }));

  // =====================================================
  //  PERÍODO
  // =====================================================

  const periodoExistente = await prisma.periodo.findFirst({
    where: {
      nombre: "Primer semestre 2026",
    },
  });

  const periodo =
    periodoExistente ??
    (await prisma.periodo.create({
      data: {
        nombre: "Primer semestre 2026",
        fecha_inicio: new Date("2026-03-01"),
        fecha_fin: new Date("2026-07-31"),
        limite_creditos: 30,
        estado: "ACTIVO",
      },
    }));

  // =====================================================
  //  MATERIA
  // =====================================================

  const materiaExistente = await prisma.materia.findFirst({
    where: {
      nombre: "Programación Web",
    },
  });

  const materia =
    materiaExistente ??
    (await prisma.materia.create({
      data: {
        nombre: "Programación Web",
        descripcion: "Introducción al desarrollo de aplicaciones web.",
        creditos: 5,
        costos_inscripcion: 5000,
        costo_mensual: 3500,
        estado: "ACTIVA",
      },
    }));

  // =====================================================
  //  AULA
  // =====================================================

  const aulaExistente = await prisma.aula.findFirst({
    where: {
      nombre: "Laboratorio 1",
    },
  });

  const aula =
    aulaExistente ??
    (await prisma.aula.create({
      data: {
        nombre: "Laboratorio 1",
        capacidad: 30,
        ubicacion: "Primer piso",
        tipo: "FISICA",
        estado: "DISPONIBLE",
      },
    }));

  // =====================================================
  //  GRUPO
  // =====================================================

  const grupoExistente = await prisma.grupo.findFirst({
    where: {
      nombre: "Grupo A",
      id_materia: materia.id_materia,
      id_periodo: periodo.id_periodo,
      id_profesor: profesor.id_profesor,
    },
  });

  const grupo =
    grupoExistente ??
    (await prisma.grupo.create({
      data: {
        id_materia: materia.id_materia,
        id_periodo: periodo.id_periodo,
        id_profesor: profesor.id_profesor,
        id_aula: aula.id_aula,
        nombre: "Grupo A",
        cupo_maximo: 30,
        estado: "ABIERTO",
      },
    }));

  // =====================================================
  //  HORARIO
  // =====================================================

  const horarioExistente = await prisma.horario.findFirst({
    where: {
      id_grupo: grupo.id_grupo,
      dia_semana: "LUNES",
    },
  });

  const horario =
    horarioExistente ??
    (await prisma.horario.create({
      data: {
        id_grupo: grupo.id_grupo,
        dia_semana: "LUNES",
        hora_inicio: new Date("1970-01-01T18:00:00"),
        hora_fin: new Date("1970-01-01T20:00:00"),
      },
    }));

  // =====================================================
  //  RESULTADO
  // =====================================================

  console.log("Seed completado correctamente.");

  console.log({
    admin: admin.email,
    profesor: profesorUsuario.email,
    estudiante: estudianteUsuario.email,
    nro_matricula: estudiante.nro_matricula,
    tutor: tutor.email,
    periodo: periodo.id_periodo,
    materia: materia.id_materia,
    aula: aula.id_aula,
    grupo: grupo.id_grupo,
    horario: horario.id_horario,
  });
}

main()
  .catch((error) => {
    console.error(" Error ejecutando el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });