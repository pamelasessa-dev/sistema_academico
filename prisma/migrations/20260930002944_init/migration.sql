-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'RECEPCIONISTA', 'PROFESOR', 'ESTUDIANTE');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('PENDIENTE', 'ACTIVO', 'SUSPENDIDO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoPeriodo" AS ENUM ('PLANIFICADO', 'ACTIVO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "EstadoMateria" AS ENUM ('ACTIVA', 'INACTIVA');

-- CreateEnum
CREATE TYPE "TipoAula" AS ENUM ('FISICA', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "EstadoAula" AS ENUM ('DISPONIBLE', 'NO_DISPONIBLE');

-- CreateEnum
CREATE TYPE "EstadoGrupo" AS ENUM ('ABIERTO', 'CERRADO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "EstadoMatricula" AS ENUM ('PENDIENTE', 'ACTIVA', 'CANCELADA', 'FINALIZADA');

-- CreateEnum
CREATE TYPE "TipoActividad" AS ENUM ('TAREA', 'PARCIAL', 'PROYECTO', 'EXAMEN');

-- CreateEnum
CREATE TYPE "EstadoActividad" AS ENUM ('BORRADOR', 'ABIERTA', 'CERRADA');

-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('ENTREGADA', 'CALIFICADA');

-- CreateEnum
CREATE TYPE "ConceptoObligacion" AS ENUM ('INSCRIPCION', 'MENSUALIDAD', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoObligacion" AS ENUM ('PENDIENTE', 'PAGADA', 'VENCIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'PASARELA');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "primer_nombre" TEXT NOT NULL,
    "segundo_nombre" TEXT,
    "primer_apellido" TEXT NOT NULL,
    "segundo_apellido" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "password" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "estudiantes" (
    "id_estudiante" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "nro_matricula" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "direccion" TEXT,
    "fecha_ingreso" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "profesores" (
    "id_profesor" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "especialidad" TEXT NOT NULL,
    "fecha_contratacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profesores_pkey" PRIMARY KEY ("id_profesor")
);

-- CreateTable
CREATE TABLE "tutores" (
    "id_tutor" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "parentesco" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT,

    CONSTRAINT "tutores_pkey" PRIMARY KEY ("id_tutor")
);

-- CreateTable
CREATE TABLE "periodos" (
    "id_periodo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "limite_creditos" INTEGER NOT NULL,
    "estado" "EstadoPeriodo" NOT NULL,

    CONSTRAINT "periodos_pkey" PRIMARY KEY ("id_periodo")
);

-- CreateTable
CREATE TABLE "materias" (
    "id_materia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "creditos" INTEGER NOT NULL,
    "costos_inscripcion" DECIMAL(10,2) NOT NULL,
    "costo_mensual" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoMateria" NOT NULL,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id_materia")
);

-- CreateTable
CREATE TABLE "aulas" (
    "id_aula" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "ubicacion" TEXT,
    "tipo" "TipoAula" NOT NULL,
    "estado" "EstadoAula" NOT NULL,

    CONSTRAINT "aulas_pkey" PRIMARY KEY ("id_aula")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id_grupo" SERIAL NOT NULL,
    "id_materia" INTEGER NOT NULL,
    "id_periodo" INTEGER NOT NULL,
    "id_profesor" INTEGER NOT NULL,
    "id_aula" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "cupo_maximo" INTEGER NOT NULL,
    "estado" "EstadoGrupo" NOT NULL,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id_horario" SERIAL NOT NULL,
    "id_grupo" INTEGER NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "hora_fin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id_horario")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id_matricula" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_grupo" INTEGER NOT NULL,
    "fecha_matricula" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoMatricula" NOT NULL,

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id_matricula")
);

-- CreateTable
CREATE TABLE "actividades_academicas" (
    "id_actividad" SERIAL NOT NULL,
    "id_grupo" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "TipoActividad" NOT NULL,
    "puntaje_maximo" DECIMAL(5,2) NOT NULL,
    "porcentaje_aporte" DECIMAL(5,2) NOT NULL,
    "fecha_apertura" TIMESTAMP(3) NOT NULL,
    "fecha_cierre" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoActividad" NOT NULL,

    CONSTRAINT "actividades_academicas_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "entregas" (
    "id_entrega" SERIAL NOT NULL,
    "id_actividad" INTEGER NOT NULL,
    "id_matricula" INTEGER NOT NULL,
    "fecha_entrega" TIMESTAMP(3) NOT NULL,
    "archivo_url" TEXT,
    "respuesta_texto" TEXT,
    "puntaje_obtenido" DECIMAL(5,2),
    "observacion_docente" TEXT,
    "estado" "EstadoEntrega" NOT NULL,

    CONSTRAINT "entregas_pkey" PRIMARY KEY ("id_entrega")
);

-- CreateTable
CREATE TABLE "obligaciones_financieras" (
    "id_obligacion" SERIAL NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_matricula" INTEGER,
    "concepto" "ConceptoObligacion" NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoObligacion" NOT NULL,

    CONSTRAINT "obligaciones_financieras_pkey" PRIMARY KEY ("id_obligacion")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id_pago" SERIAL NOT NULL,
    "id_obligacion" INTEGER NOT NULL,
    "id_usuario_verificador" INTEGER,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "estado" "EstadoPago" NOT NULL,
    "fecha_validacion" TIMESTAMP(3),
    "observacion" TEXT,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "auditorias" (
    "id_auditoria" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "entidad" TEXT NOT NULL,
    "id_registro" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "valor_anterior" JSONB,
    "valor_nuevo" JSONB,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detalle" TEXT,

    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id_auditoria")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_id_usuario_key" ON "estudiantes"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_nro_matricula_key" ON "estudiantes"("nro_matricula");

-- CreateIndex
CREATE UNIQUE INDEX "profesores_id_usuario_key" ON "profesores"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "matriculas_id_estudiante_id_grupo_key" ON "matriculas"("id_estudiante", "id_grupo");

-- CreateIndex
CREATE UNIQUE INDEX "entregas_id_actividad_id_matricula_key" ON "entregas"("id_actividad", "id_matricula");

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "tutores"("id_tutor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profesores" ADD CONSTRAINT "profesores_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "materias"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_id_periodo_fkey" FOREIGN KEY ("id_periodo") REFERENCES "periodos"("id_periodo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_id_profesor_fkey" FOREIGN KEY ("id_profesor") REFERENCES "profesores"("id_profesor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupos" ADD CONSTRAINT "grupos_id_aula_fkey" FOREIGN KEY ("id_aula") REFERENCES "aulas"("id_aula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupos"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupos"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades_academicas" ADD CONSTRAINT "actividades_academicas_id_grupo_fkey" FOREIGN KEY ("id_grupo") REFERENCES "grupos"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "actividades_academicas"("id_actividad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_id_matricula_fkey" FOREIGN KEY ("id_matricula") REFERENCES "matriculas"("id_matricula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligaciones_financieras" ADD CONSTRAINT "obligaciones_financieras_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligaciones_financieras" ADD CONSTRAINT "obligaciones_financieras_id_matricula_fkey" FOREIGN KEY ("id_matricula") REFERENCES "matriculas"("id_matricula") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_obligacion_fkey" FOREIGN KEY ("id_obligacion") REFERENCES "obligaciones_financieras"("id_obligacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_usuario_verificador_fkey" FOREIGN KEY ("id_usuario_verificador") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
