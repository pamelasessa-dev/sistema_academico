## Entidades

## Entidad: Usuario

| Atributo           | Tipo          | Notas              |
| ------------------ | ------------- | ------------------ |
| `id_usuario`       | Número Entero | PK autoincremental |
| `primer_nombre`    | Texto         | Obligatorio        |
| `segundo_nombre`   | Texto         | Opcional           |
| `primer_apellido`  | Texto         | Obligatorio        |
| `segundo_apellido` | Texto         | Opcional           |
| `email`            | Texto         | Obligatorio, único |
| `telefono`         | Texto         | Opcional           |
| `password`         | Texto         | Obligatorio        |
| `rol`              | ENUM          | Obligatorio        |
| `estado`           | ENUM          | Obligatorio        |
| `fecha_creacion`   | Fecha/Hora    | Obligatorio        |


Valores de rol: ADMIN, RECEPCIONISTA, PROFESOR, ESTUDIANTE.

Valores de estado: PENDIENTE, ACTIVO, SUSPENDIDO, INACTIVO.


## Entidad: Estudiante

| Atributo           | Tipo          | Notas                 |
| ------------------ | ------------- | --------------------- |
| `id_estudiante`    | Numero Entero | [PK] autoincremental  |
| `id_usuario`       | Numero Entero | [FK - Usuario], unico |
| `id_tutor`         | Numero Entero | [FK - Tutor]          |
| `nro_matricula`    | Texto         | Obligatorio, unico    |
| `fecha_nacimiento` | Fecha         | Obligatorio           |
| `direccion`        | Texto         | Opcional              |
| `fecha_ingreso`    | Fecha         | Obligatorio           |


## Entidad: Profesor

| Atributo             | Tipo          | Notas                 |
| -------------------- | ------------- | --------------------- |
| `id_profesor`        | Numero Entero | [PK] autoincremental  |
| `id_usuario`         | Numero Entero | [FK - Usuario], unico |
| `especialidad`       | Texto         | Obligatorio           |
| `fecha_contratacion` | Fecha         | Obligatorio           |



## Entidad: Tutor

| Atributo     | Tipo          | Notas                |
| ------------ | ------------- | -------------------- |
| `id_tutor`   | Numero Entero | [PK] autoincremental |
| `nombre`     | Texto         | Obligatorio          |
| `apellido`   | Texto         | Obligatorio          |
| `parentesco` | Texto         | Obligatorio          |
| `telefono`   | Texto         | Obligatorio          |
| `email`      | Texto         | Opcional             |
| `direccion`  | Texto         | Opcional             |

TUTOR tiene su propio email y teléfono de contacto.

## Entidad: Periodo

| Atributo          | Tipo          | Notas                |
| ----------------- | ------------- | -------------------- |
| `id_periodo`      | Numero Entero | [PK] autoincremental |
| `nombre`          | Texto         | Obligatorio          |
| `fecha_inicio`    | Fecha         | Obligatorio          |
| `fecha_fin`       | Fecha         | Obligatorio          |
| `limite_creditos` | Numero Entero | Obligatorio          |
| `estado`          | ENUM          | Obligatorio          |

Valores de estado: PLANIFICADO, ACTIVO, FINALIZADO.


## Entidad: Materia

| Atributo            | Tipo          | Notas                |
| ------------------- | ------------- | -------------------- |
| `id_materia`        | Numero Entero | [PK] autoincremental |
| `nombre`            | Texto         | Obligatorio          |
| `descripcion`       | Texto         | Opcional             |
| `creditos`          | Numero Entero | Obligatorio          |
| `costo_inscripcion` | Decimal       | Obligatorio          |
| `costo_mensual`     | Decimal       | Obligatorio          |
| `estado`            | ENUM          | Obligatorio          |

Restricción: una matrícula puede tener una única entrega por actividad.
Valores de estado: ACTIVA, INACTIVA.
UNIQUE (id_actividad, id_matricula)
El estudiante de la matrícula 5 entregó la actividad 1.

## Entidad: Aula

| Atributo    | Tipo          | Notas                |
| ----------- | ------------- | -------------------- |
| `id_aula`   | Numero Entero | [PK] autoincremental |
| `nombre`    | Texto         | Obligatorio          |
| `capacidad` | Numero Entero | Obligatorio          |
| `ubicacion` | Texto         | Opcional             |
| `tipo`      | ENUM          | Obligatorio          |
| `estado`    | ENUM          | Obligatorio          |

Valores de tipo: FISICA, VIRTUAL.

Valores de estado: DISPONIBLE, NO_DISPONIBLE.

## Entidad: Grupo

| Atributo      | Tipo          | Notas                |
| ------------- | ------------- | -------------------- |
| `id_grupo`    | Numero Entero | [PK] autoincremental |
| `id_materia`  | Numero Entero | [FK - Materia]       |
| `id_periodo`  | Numero Entero | [FK - Periodo]       |
| `id_profesor` | Numero Entero | [FK - Profesor]      |
| `id_aula`     | Numero Entero | [FK - Aula]          |
| `nombre`      | Texto         | Obligatorio          |
| `cupo_maximo` | Numero Entero | Obligatorio          |
| `estado`      | ENUM          | Obligatorio          |

Valores de estado: ABIERTO, CERRADO, FINALIZADO.

## Entidad: Horario

| Atributo      | Tipo          | Notas                |
| ------------- | ------------- | -------------------- |
| `id_horario`  | Numero Entero | [PK] autoincremental |
| `id_grupo`    | Numero Entero | [FK - Grupo]         |
| `dia_semana`  | ENUM          | Obligatorio          |
| `hora_inicio` | Hora          | Obligatorio          |
| `hora_fin`    | Hora          | Obligatorio          |

Valores de dia_semana: LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO, DOMINGO.

## Entidad: Matricula

| Atributo          | Tipo          | Notas                |
| ----------------- | ------------- | -------------------- |
| `id_matricula`    | Numero Entero | [PK] autoincremental |
| `id_estudiante`   | Numero Entero | [FK - Estudiante]    |
| `id_grupo`        | Numero Entero | [FK - Grupo]         |
| `fecha_matricula` | Fecha         | Obligatorio          |
| `estado`          | ENUM          | Obligatorio          |

Valores de estado: PENDIENTE, ACTIVA, CANCELADA, FINALIZADA.

Restriccion: combinacion id_estudiante + id_grupo unica.

## Entidad: Actividad Academica

| Atributo            | Tipo          | Notas                |
| ------------------- | ------------- | -------------------- |
| `id_actividad`      | Numero Entero | [PK] autoincremental |
| `id_grupo`          | Numero Entero | [FK - Grupo]         |
| `titulo`            | Texto         | Obligatorio          |
| `descripcion`       | Texto         | Opcional             |
| `tipo`              | ENUM          | Obligatorio          |
| `puntaje_maximo`    | Decimal       | Obligatorio          |
| `porcentaje_aporte` | Decimal       | Obligatorio          |
| `fecha_apertura`    | Fecha/Hora    | Obligatorio          |
| `fecha_cierre`      | Fecha/Hora    | Obligatorio          |
| `estado`            | ENUM          | Obligatorio          |

Valores de tipo: TAREA, PARCIAL, PROYECTO, EXAMEN.

Valores de estado: BORRADOR, ABIERTA, CERRADA.

Regla: la suma de los porcentajes de aporte de las actividades de un grupo debe ser 100%.


## Entidad: Entrega

| Atributo              | Tipo          | Notas                      |
| --------------------- | ------------- | -------------------------- |
| `id_entrega`          | Numero Entero | [PK] autoincremental       |
| `id_actividad`        | Numero Entero | [FK - Actividad Academica] |
| `id_matricula`        | Numero Entero | [FK - Matricula]           |
| `fecha_entrega`       | Fecha/Hora    | Obligatorio                |
| `archivo_url`         | Texto         | Opcional                   |
| `respuesta_texto`     | Texto         | Opcional                   |
| `puntaje_obtenido`    | Decimal       | Opcional                   |
| `observacion_docente` | Texto         | Opcional                   |
| `estado`              | ENUM          | Obligatorio                |

Valores de estado: ENTREGADA, CALIFICADA.

Restriccion: un estudiante puede tener una unica entrega por actividad.


## Entidad: Obligacion Financiera

| Atributo            | Tipo          | Notas                      |
| ------------------- | ------------- | -------------------------- |
| `id_obligacion`     | Numero Entero | [PK] autoincremental       |
| `id_estudiante`     | Numero Entero | [FK - Estudiante]          |
| `id_matricula`      | Numero Entero | [FK - Matricula], opcional |
| `concepto`          | ENUM          | Obligatorio                |
| `monto`             | Decimal       | Obligatorio                |
| `fecha_emision`     | Fecha         | Obligatorio                |
| `fecha_vencimiento` | Fecha         | Obligatorio                |
| `estado`            | ENUM          | Obligatorio                |

id_estudiante sirve para obligaciones generales:

INSCRIPCION
OTRO

id_matricula permite relacionar una obligación con una matrícula concreta.

Si id_matricula está informado, esa matrícula debe pertenecer al mismo id_estudiante.
Una Obligación Financiera puede tener cero o muchos Pagos (1:N).
Valores de concepto: INSCRIPCION, MENSUALIDAD, OTRO.

Valores de estado: PENDIENTE, PAGADA, VENCIDA, CANCELADA.

## Entidad: Pago

| Atributo                 | Tipo          | Notas                        |
| ------------------------ | ------------- | ---------------------------- |
| `id_pago`                | Numero Entero | [PK] autoincremental         |
| `id_obligacion`          | Numero Entero | [FK - Obligacion Financiera] |
| `id_usuario_verificador` | Numero Entero | [FK - Usuario], opcional     |
| `monto`                  | Decimal       | Obligatorio                  |
| `fecha_pago`             | Fecha/Hora    | Obligatorio                  |
| `metodo`                 | ENUM          | Obligatorio                  |
| `estado`                 | ENUM          | Obligatorio                  |
| `fecha_validacion`       | Fecha/Hora    | Opcional                     |
| `observacion`            | Texto         | Opcional                     |

Valores de metodo: EFECTIVO, TRANSFERENCIA, PASARELA.

Valores de estado: PENDIENTE, APROBADO, RECHAZADO.
id_usuario_verificador


## Entidad: Auditoria

| Atributo         | Tipo          | Notas                |
| ---------------- | ------------- | -------------------- |
| `id_auditoria`   | Numero Entero | [PK] autoincremental |
| `id_usuario`     | Numero Entero | [FK - Usuario]       |
| `entidad`        | Texto         | Obligatorio          |
| `id_registro`    | Numero Entero | Obligatorio          |
| `accion`         | Texto         | Obligatorio          |
| `valor_anterior` | JSON          | Opcional             |
| `valor_nuevo`    | JSON          | Opcional             |
| `fecha`          | Fecha/Hora    | Obligatorio          |
| `detalle`        | Texto         | Opcional             |


## Relaciones

Un Usuario puede estar asociado a cero o un Estudiante (1:0..1).
Un Usuario puede estar asociado a cero o un Profesor (1:0..1).
Un Tutor puede estar asociado a muchos Estudiantes, pero cada estudiante tiene un tutor (1:N).
Una Materia puede tener muchos Grupos, pero cada grupo pertenece a una materia (1:N).
Un Periodo puede tener muchos Grupos, pero cada grupo pertenece a un periodo (1:N).
Un Profesor puede estar asignado a muchos Grupos, pero cada grupo tiene un profesor (1:N).
Un Aula puede ser utilizada por muchos Grupos, pero cada grupo tiene un aula (1:N).
Un Grupo puede tener muchos Horarios (1:N).
Un Estudiante puede tener muchas Matriculas y un Grupo puede tener muchos estudiantes mediante Matricula (N:M).
Un Grupo puede tener muchas Actividades Academicas (1:N).
Una Actividad Académica puede tener cero o muchas Entregas.(1:N).
Una Matricula puede tener muchas Entregas (1:N).
Un Estudiante puede tener muchas Obligaciones Financieras (1:N).
Una Obligacion Financiera puede tener CERO o varios Pagos (1:N).
Un Usuario puede verificar muchos Pagos (1:N).
Un Usuario puede generar muchos registros de Auditoria (1:N).

1FN: cumple porque...

Cada atributo contiene valores atómicos y no se almacenan listas de valores dentro de una misma columna. Por ejemplo, los nombres están separados en atributos individuales y los horarios se registran como registros independientes en HORARIO.

2FN: cumple porque...

Los atributos no clave dependen completamente de la clave primaria de su entidad. Se utilizan claves primarias simples y, cuando existe una relación que podría generar duplicados, se establecen restricciones UNIQUE, como (id_estudiante, id_grupo) en MATRICULA y (id_actividad, id_matricula) en ENTREGA.

3FN: cumple porque...

Los atributos no clave dependen directamente de la clave primaria y se evita almacenar información que pertenece a otra entidad. Por ejemplo, los datos personales del estudiante y profesor se mantienen en USUARIO, mientras que ESTUDIANTE y PROFESOR contienen únicamente información específica de cada perfil. De igual forma, los datos de la materia no se repiten en GRUPO, sino que se referencian mediante id_materia.

## Justificación de las entidades

| Entidad                  | ¿Por qué existe?                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Usuario**              | Centraliza los datos de autenticación, identidad, rol y estado de las personas que utilizan el sistema.                |
| **Estudiante**           | Representa la información académica específica de un estudiante y su vínculo con un usuario y tutor.                   |
| **Profesor**             | Representa la información laboral y académica específica de los profesores.                                            |
| **Tutor**                | Almacena los datos de contacto del responsable o referente del estudiante sin convertirlo en usuario del sistema.      |
| **Periodo**              | Define los períodos académicos en los que se organizan las actividades educativas.                                     |
| **Materia**              | Contiene la información académica y los costos asociados a cada materia.                                               |
| **Aula**                 | Permite registrar los espacios físicos o virtuales disponibles para los grupos.                                        |
| **Grupo**                | Representa una instancia concreta de una materia dentro de un período, profesor y aula determinados.                   |
| **Horario**              | Permite definir los días y horarios en los que funciona cada grupo.                                                    |
| **Matricula**            | Registra la inscripción de un estudiante a un grupo y resuelve la relación muchos a muchos entre estudiantes y grupos. |
| **ActividadAcademica**   | Representa las actividades mediante las cuales se evalúa el desempeño de los estudiantes.                              |
| **Entrega**              | Registra la entrega de un estudiante para una actividad y permite almacenar su resultado y observaciones.              |
| **ObligacionFinanciera** | Registra los importes que un estudiante debe abonar por conceptos académicos o administrativos.                        |
| **Pago**                 | Registra los pagos realizados sobre las obligaciones financieras y su estado de validación.                            |
| **Auditoria**            | Permite conservar un historial de acciones y cambios relevantes realizados por los usuarios.                           |
