# SGAF — Sistema de Gestión Académica y Financiera

API REST desarrollada con NestJS para la gestión de procesos académicos, administrativos y financieros de una institución educativa.

El sistema permite administrar usuarios, estudiantes, profesores, períodos, materias, grupos, aulas, horarios, matrículas, actividades académicas, entregas, obligaciones financieras y pagos.

La aplicación cuenta con autenticación mediante JWT, autorización basada en roles, validaciones, auditoría, documentación mediante Swagger/OpenAPI, persistencia en PostgreSQL e integración con la pasarela de pagos simulada MockPay.

---

#  Descripción del proyecto

El **Sistema de Gestión Académica y Financiera (SGAF)** centraliza diferentes procesos de una institución educativa en una API REST.

El sistema contempla tres áreas principales:

### Área de identidad y usuarios

- Registro de estudiantes.
- Autenticación.
- Gestión de usuarios.
- Roles y permisos.
- Estados de usuario.
- Aprobación de postulantes.

### Área académica

- Gestión de períodos.
- Gestión de materias.
- Gestión de grupos.
- Gestión de profesores.
- Gestión de aulas.
- Gestión de horarios.
- Matrículas.
- Actividades académicas.
- Entregas y calificaciones.

### Área financiera

- Obligaciones financieras.
- Registro de pagos.
- Aprobación y rechazo de pagos manuales.
- Integración con MockPay.
- Webhooks de pagos.
- Actualización automática del estado de los pagos.
- Auditoría de operaciones relevantes.

---

#  Objetivos

## Objetivo general

Desarrollar una API REST que permita gestionar de forma integrada los procesos académicos, administrativos y financieros de una institución educativa.

## Objetivos específicos

- Implementar una API REST utilizando NestJS.
- Diseñar una base de datos relacional en PostgreSQL.
- Aplicar Prisma ORM para el acceso a datos.
- Implementar autenticación mediante JWT.
- Implementar autorización mediante roles.
- Aplicar validaciones de entrada.
- Implementar reglas de negocio para las matrículas.
- Gestionar actividades y entregas académicas.
- Gestionar obligaciones y pagos.
- Integrar una pasarela de pagos simulada.
- Implementar un webhook para recibir notificaciones de pagos.
- Documentar la API mediante Swagger/OpenAPI.
- Desplegar la aplicación en Render.
- Utilizar Supabase como proveedor de PostgreSQL en producción.
- Implementar migraciones y seed de datos.
- Mantener una estructura organizada y versionada mediante Git.

---

##  Funcionalidades principales

## Usuarios

El sistema maneja los siguientes roles:

- ADMIN
- RECEPCIONISTA
- PROFESOR
- ESTUDIANTE

Estados de usuario:

- PENDIENTE
- ACTIVO
- SUSPENDIDO
- INACTIVO

Los estudiantes pueden registrarse como postulantes y permanecer en estado pendiente hasta que se complete el proceso correspondiente de aprobación.

---

## Gestión académica

El sistema permite administrar:

- Estudiantes.
- Profesores.
- Tutores.
- Períodos académicos.
- Materias.
- Aulas.
- Grupos.
- Horarios.
- Matrículas.
- Actividades académicas.
- Entregas.

---

## Gestión financiera

El sistema permite:

- Crear obligaciones financieras.
- Consultar obligaciones.
- Registrar pagos.
- Consultar pagos.
- Aprobar pagos manualmente.
- Rechazar pagos manualmente.
- Registrar observaciones.
- Integrar pagos mediante MockPay.
- Procesar webhooks.
- Actualizar automáticamente pagos de pasarela.
- Marcar obligaciones como pagadas cuando corresponde.

---

# Tecnologías utilizadas

| Tecnología        | Uso                        |
|-------------------|----------------------------|
| NestJS            | Framework backend          |
| TypeScript        | Lenguaje                   |
| Prisma            | ORM                        |
| PostgreSQL        | Base de datos              |
| Passport          | Autenticación              |
| JWT               | Tokens de autenticación    |
| class-validator   | Validación de DTOs         |
| Swagger / OpenAPI | Documentación de API       |
| MockPay           | Pasarela de pagos simulada |
| Supabase          | PostgreSQL en producción   |
| Render            | Despliegue de la API       |
| pnpm              | Gestor de paquetes         |
| Git / GitHub      | Control de versiones       |

---

#  Arquitectura del proyecto

La aplicación utiliza una arquitectura modular basada en NestJS.

Cada módulo contiene las responsabilidades correspondientes a una determinada área del sistema.

De forma general:


Cliente
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
PrismaService
   │
   ▼
PostgreSQL


# Para operaciones protegidas

Cliente
   │
   ▼
JWT
   │
   ▼
Guards
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Prisma
   │
   ▼
PostgreSQL

## Requisitos previos

Para ejecutar el proyecto localmente se necesita:

Node.js
pnpm
PostgreSQL
Git

## Instalación

Clonar el repositorio:

git clone https://github.com/pamelasessa-dev/sistema_academico.git


Ingresar al proyecto:

cd sistema_academico

Instalar las dependencias:

pnpm install


## Variables de entorno

Crear un archivo .env en la raíz del proyecto.

# .env.example

El archivo .env no debe versionarse. Se incluye únicamente .env.example como referencia de las variables necesarias.

## Base de datos

El proyecto utiliza PostgreSQL como sistema gestor de base de datos.

En producción la base de datos se encuentra gestionada mediante Supabase.

Prisma se utiliza como ORM para:

Definir el modelo de datos.
Generar el cliente.
Ejecutar consultas.
Crear migraciones.
Gestionar relaciones.
Ejecutar el seed.

## Schema Prisma

El modelo se encuentra en:

prisma/schema.prisma

# Migraciones

Las migraciones se encuentran en:

prisma/migrations/

Para generar el cliente Prisma:

pnpm prisma generate --config prisma7.config.ts

Para aplicar migraciones:

pnpm prisma migrate deploy --config prisma7.config.ts

# Seed

El proyecto incluye un seed con datos iniciales para realizar las pruebas.

El seed se encuentra en:

prisma/seed.ts

Incluye usuarios de prueba, información académica y datos financieros necesarios para ejecutar los principales flujos del sistema.


## Modelo de datos

El sistema utiliza un modelo relacional normalizado.

Las principales entidades son:

Usuario
Estudiante
Profesor
Tutor
Periodo
Materia
Aula
Grupo
Horario
Matrícula
Actividad Académica
Entrega
Obligación Financiera
Pago
Auditoría

La descripción detallada de cada entidad, sus atributos, relaciones, restricciones y reglas de normalización se encuentra en:

requerimientos.md

##  Diagrama Entidad-Relación

El proyecto incluye un Diagrama Entidad-Relación generado a partir de la estructura de la base de datos.

Archivo:

DER/der-sgaf.png

El modelo contiene las entidades académicas, administrativas y financieras, junto con sus claves primarias, claves foráneas y relaciones.

## Autenticación

La API utiliza autenticación mediante JWT.

El usuario inicia sesión y obtiene un token.

Las solicitudes protegidas deben incluir:

Authorization: Bearer <token>

El token permite identificar al usuario autenticado y aplicar las restricciones correspondientes.


## Autorización y roles

El sistema utiliza autorización basada en roles.

ADMIN

Responsable de las operaciones administrativas generales del sistema.

RECEPCIONISTA

Responsable de operaciones administrativas y financieras que requieren validación.

PROFESOR

Responsable de las operaciones académicas correspondientes a sus grupos.

ESTUDIANTE

Puede consultar y gestionar la información correspondiente a su perfil, matrículas, actividades, entregas y obligaciones.

Los permisos se aplican mediante guards y decoradores de roles.


## Módulos de la API

La API se encuentra organizada en módulos de NestJS.

Entre ellos:

Autenticación
Usuarios
Estudiantes
Profesores
Tutores
Períodos
Materias
Aulas
Grupos
Horarios
Matrículas
Actividades
Entregas
Obligaciones
Pagos
Auditoría

La lista completa de endpoints, parámetros, DTOs y respuestas se encuentra disponible en Swagger.

##  Reglas de negocio


# Matrículas

Antes de realizar una matrícula se valida:

que el estudiante pueda matricularse;
que el grupo exista;
que el grupo esté abierto;
que el período esté activo;
que la materia esté activa;
que existan cupos;
que no exista una matrícula duplicada;
que el estudiante no esté matriculado en otra sección de la misma materia durante el período;
que no se supere el límite de créditos;
que no exista un traslape de horarios;
que no existan obligaciones financieras vencidas.

# Actividades

Las actividades pertenecen a un grupo.

Cada actividad posee:

título;
descripción;
tipo;
puntaje máximo;
porcentaje de aporte;
fecha de apertura;
fecha de cierre;
estado.

La suma de los porcentajes de las actividades de un grupo debe representar el 100% de la evaluación.

# Entregas

Una matrícula puede realizar una única entrega para una determinada actividad.

Se aplica la restricción:

UNIQUE(id_actividad, id_matricula)

Las entregas pueden ser calificadas por el docente correspondiente.

## Gestión financiera

Las obligaciones financieras pueden corresponder a:

INSCRIPCION
MENSUALIDAD
OTRO

Estados:

PENDIENTE
PAGADA
VENCIDA
CANCELADA

Los pagos pueden realizarse mediante:

EFECTIVO
TRANSFERENCIA
PASARELA

Estados de pago:

PENDIENTE
APROBADO
RECHAZADO


## Integración con MockPay

El proyecto integra MockPay como pasarela de pagos simulada.

La API utilizada es:

https://api-mock-payment.funvaltech.cloud

El backend realiza una solicitud:

POST /api/v1/payments

enviando:

monto;
moneda;
metadata.

MockPay devuelve:

identificador de transacción;
URL de checkout.

Estos datos se almacenan en:

id_mockpay
checkout_url


## Flujo de pago


ESTUDIANTE
    │
    ▼
POST /pagos
    │
    ▼
SGAF crea Pago PENDIENTE
    │
    ▼
MockPay
    │
    ▼
checkout_url
    │
    ▼
ESTUDIANTE REALIZA EL PAGO
    │
    ▼
MockPay procesa el pago
    │
    ▼
WEBHOOK
    │
    ▼
POST /pagos/webhook
    │
    ├── payment.succeeded
    │          │
    │          ▼
    │      APROBADO
    │
    └── payment.failed
               │
               ▼
           RECHAZADO


## Webhook

El webhook público del proyecto es:

https://sistema-academico-avh7.onrender.com/pagos/webhook

Los eventos procesados son:

payment.succeeded
payment.failed

Cuando llega payment.succeeded:

PENDIENTE → APROBADO

Cuando llega payment.failed:

PENDIENTE → RECHAZADO

Si el total de pagos aprobados alcanza el monto de la obligación, la obligación pasa a:

PAGADA

## Auditoría

El sistema incluye una entidad de auditoría para registrar operaciones relevantes.

Los registros pueden incluir:

usuario que realizó la operación;
entidad afectada;
identificador del registro;
acción;
valor anterior;
valor nuevo;
fecha;
detalle.

Esto permite mantener un historial de determinadas operaciones del sistema.

## Validaciones

La API utiliza DTOs y class-validator para validar los datos recibidos.

Entre las validaciones se encuentran:

campos obligatorios;
tipos de datos;
formatos;
valores permitidos;
identificadores;
relaciones entre entidades;
reglas específicas de negocio.

Las validaciones de negocio se realizan en los servicios correspondientes.

## Manejo de errores

La API utiliza códigos HTTP apropiados según el resultado de cada operación.

Ejemplos:

200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error

Ejemplo de recurso inexistente:

{
  "message": "El pago no existe",
  "error": "Not Found",
  "statusCode": 404
}

Ejemplo de acceso no autorizado:

{
  "message": "No tienes permisos para realizar esta acción",
  "error": "Forbidden",
  "statusCode": 403
}

## Swagger / OpenAPI

La API está documentada mediante Swagger/OpenAPI.

Producción
https://sistema-academico-avh7.onrender.com/api
Local
http://localhost:3000/api

Swagger permite:

consultar endpoints;
consultar DTOs;
consultar parámetros;
consultar respuestas;
probar operaciones;
utilizar autenticación JWT;
visualizar los esquemas de datos.


## Pruebas principales

Durante el desarrollo se probaron los principales flujos de la API.

Autenticación
Login exitoso.
Credenciales incorrectas.
Usuario inexistente.
Acceso sin token.
Acceso con rol no autorizado.
Grupos
Listado de grupos.
Consulta de grupo existente.
Consulta de grupo inexistente.
Matrículas
Creación de matrícula.
Validación de cupos.
Validación de período.
Validación de materia.
Validación de créditos.
Validación de horarios.
Validación de obligaciones vencidas.
Actividades
Creación.
Consulta.
Entrega.
Validación de permisos.
Calificación.
Pagos
Consulta de pagos.
Consulta de pago por ID.
Creación de pago.
Aprobación manual.
Rechazo manual.
Creación mediante MockPay.
Obtención del checkout.
Procesamiento del webhook.
Actualización automática a APROBADO.
Actualización automática a RECHAZADO.


## Credenciales de prueba

Rol	           |  Email	                               |   Contraseña
---------------|---------------------------------------|----------------------
ADMIN	         | admin@sistemaacademico.com	           |    Admin123
RECEPCIONISTA	 | recepcionista@sistemaacademico.com	   |    Recepcionista123
PROFESOR	     | profesor@sistemaacademico.com	       |    Profesor123
ESTUDIANTE	   | estudiante@sistemaacademico.com	     |    Estudiante123

Estas credenciales corresponden al seed utilizado para las pruebas del proyecto.

## Ejecución local

# Instalar dependencias:

pnpm install

# Generar Prisma:

pnpm prisma generate --config prisma7.config.ts

# Aplicar migraciones:

pnpm prisma migrate deploy --config prisma7.config.ts

# Ejecutar el proyecto:

pnpm run start:dev

# La API estará disponible en:

http://localhost:3000

# Swagger:

http://localhost:3000/api

## Despliegue

La aplicación se encuentra desplegada en Render.

API

https://sistema-academico-avh7.onrender.com

Swagger

https://sistema-academico-avh7.onrender.com/api

Base de datos

La base de datos PostgreSQL de producción se encuentra gestionada mediante Supabase.

## Configuración de Render

El proyecto utiliza variables de entorno configuradas en Render.

La construcción de la aplicación utiliza:

pnpm install && pnpm prisma generate --config prisma7.config.ts && pnpm run build

Las variables sensibles no se almacenan en el repositorio.

## Base de datos en producción

La base de datos de producción utiliza PostgreSQL administrado mediante Supabase.

El despliegue contempla:

conexión mediante DATABASE_URL;
generación del cliente Prisma;
migraciones;
seed de datos;
persistencia de la información de la aplicación.

## Seed en producción

El proyecto dispone de datos iniciales para facilitar la demostración y pruebas.

El seed permite disponer de:

usuarios;
estudiantes;
profesores;
períodos;
materias;
grupos;
matrículas;
obligaciones financieras;
pagos;
demás datos necesarios para ejecutar los flujos principales.

## Flujo de demostración

El flujo recomendado para la demostración final es:

1. Registrar / consultar usuario
          ↓
2. Autenticarse
          ↓
3. Obtener JWT
          ↓
4. Realizar proceso de aprobación
          ↓
5. Consultar períodos y grupos
          ↓
6. Realizar matrícula
          ↓
7. Consultar información académica
          ↓
8. Crear / consultar actividad
          ↓
9. Realizar entrega
          ↓
10. Registrar / consultar obligación financiera
          ↓
11. Crear pago
          ↓
12. Realizar pago mediante MockPay
          ↓
13. Recibir webhook
          ↓
14. Confirmar pago APROBADO
          ↓
15. Consultar historial financiero

Este flujo permite demostrar la integración entre los módulos principales de la aplicación.

## Seguridad

Se aplican medidas básicas de seguridad:

autenticación mediante JWT;
autorización mediante roles;
validación de DTOs;
variables de entorno para secretos;
claves privadas fuera del repositorio;
control de acceso mediante guards;
validación de relaciones entre entidades.

El archivo .env está excluido del control de versiones.

## Control de versiones

El proyecto utiliza Git y GitHub para controlar los cambios.

Las funcionalidades se desarrollan mediante ramas específicas antes de integrarse a la rama principal.

Ejemplo:

main
│
├── feature/finanzas
├── feature/matriculas
├── feature/modulos-api
├── feature/identidad-autenticacion
└── feature/documentacion-final

## Documentación adicional

El archivo:

requerimientos.md

contiene la documentación detallada del modelo de datos, incluyendo:

entidades;
atributos;
claves primarias;
claves foráneas;
relaciones;
restricciones;
reglas de normalización;
reglas de negocio.

## El archivo:

DER/der-sgaf.png

contiene el Diagrama Entidad-Relación del sistema.

