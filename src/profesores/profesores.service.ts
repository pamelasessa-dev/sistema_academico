import { Injectable, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateProfesorDto } from './dto/create-profesor.dto.js';
import { UpdateProfesorDto } from './dto/update-profesor.dto.js';

// service contiene la lógica
// lo que tiene que hacer el sistema con los profesores.
//
// findAll - lista de profesores
// findOne - busca un profesor específico
// create - crea un profesor
// update - modifica un profesor
// remove - elimina un profesor
//
// Con Prisma, estas operaciones se convierten
// en consultas a PostgreSQL.
//
// Prisma genera el cliente que después usamos
// basado en el modelo de nuestro schema.prisma.
//
// Ejemplo:
// this.prisma.profesor

@Injectable()
export class ProfesoresService {
  constructor(private readonly prisma: PrismaService) {}

  // --------------------------------------------------
  // LISTAR TODOS LOS PROFESORES
  // --------------------------------------------------

  async findAll() {
    return this.prisma.profesor.findMany({
      // Buscar todos los registros de profesor.
      //
      // Con select mostramos solamente
      // los datos que queremos devolver.

      select: {
        id_profesor: true,
        especialidad: true,
        fecha_contratacion: true,

        usuario: {
          select: {
            id_usuario: true,
            primer_nombre: true,
            primer_apellido: true,
            segundo_apellido: true,
            email: true,
            estado: true,
          },
        },
      },
    });
  }

  // --------------------------------------------------
  // BUSCAR UN PROFESOR
  // --------------------------------------------------

  async findOne(id: number) {
    return this.prisma.profesor.findUniqueOrThrow({
      where: {
        id_profesor: id,
      },

      select: {
        id_profesor: true,
        especialidad: true,
        fecha_contratacion: true,

        usuario: {
          select: {
            id_usuario: true,
            primer_nombre: true,
            segundo_nombre: true,
            primer_apellido: true,
            segundo_apellido: true,
            email: true,
            rol: true,
            estado: true,
          },
        },
      },
    });
  }

  // --------------------------------------------------
  // CREAR UN PROFESOR
  // --------------------------------------------------

  async create(dto: CreateProfesorDto) {
    // La contraseña nunca se guarda directamente.
    // Primero la convertimos en un hash.
    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      // Primero creamos el usuario.
      const usuario = await tx.usuario.create({
        data: {
          primer_nombre: dto.primer_nombre,
          segundo_nombre: dto.segundo_nombre,
          primer_apellido: dto.primer_apellido,
          segundo_apellido: dto.segundo_apellido,
          email: dto.email,
          password: passwordHash,

          // El backend establece estos valores.
          // El cliente no puede elegirlos.
          rol: 'PROFESOR',
          estado: 'ACTIVO',
        },
      });

      // Después creamos el perfil de profesor
      // relacionado con ese usuario.
      const profesor = await tx.profesor.create({
        data: {
          id_usuario: usuario.id_usuario,
          especialidad: dto.especialidad,
          fecha_contratacion: new Date(dto.fecha_contratacion),
        },
      });

      return {
        id_profesor: profesor.id_profesor,
        especialidad: profesor.especialidad,
        fecha_contratacion: profesor.fecha_contratacion,

        usuario: {
          id_usuario: usuario.id_usuario,
          primer_nombre: usuario.primer_nombre,
          segundo_nombre: usuario.segundo_nombre,
          primer_apellido: usuario.primer_apellido,
          segundo_apellido: usuario.segundo_apellido,
          email: usuario.email,
          rol: usuario.rol,
          estado: usuario.estado,
        },
      };
    });

    // Una transacción agrupa varias operaciones como una sola.
    //
    // Si todas funcionan:
    // COMMIT → se guardan los cambios.
    //
    // Si alguna falla:
    // ROLLBACK → se deshacen todos los cambios.
    //
    // En este caso:
    // Usuario + Profesor se crean juntos.
  }

  // --------------------------------------------------
  // ACTUALIZAR UN PROFESOR
  // --------------------------------------------------

  async update(id: number, dto: UpdateProfesorDto) {
    return this.prisma.$transaction(async (tx) => {
      // Primero buscamos el profesor.
      //
      // Necesitamos su id_usuario porque los datos
      // están repartidos entre Profesor y Usuario.

      const profesor = await tx.profesor.findUnique({
        where: {
          id_profesor: id,
        },
      });

      if (!profesor) {
        // Esto permite que nuestro filtro Prisma
        // no sea necesario para este caso.
        //
        // Más adelante podemos decidir si queremos
        // manejarlo con P2025 o explícitamente.
        throw new NotFoundException('Profesor no encontrado');
      }

      // ----------------------------------------------
      // Actualizar datos de Usuario
      // ----------------------------------------------

      const usuario = await tx.usuario.update({
        where: {
          id_usuario: profesor.id_usuario,
        },

        data: {
          ...(dto.primer_nombre !== undefined && {
            primer_nombre: dto.primer_nombre,
          }),

          ...(dto.segundo_nombre !== undefined && {
            segundo_nombre: dto.segundo_nombre,
          }),

          ...(dto.primer_apellido !== undefined && {
            primer_apellido: dto.primer_apellido,
          }),

          ...(dto.segundo_apellido !== undefined && {
            segundo_apellido: dto.segundo_apellido,
          }),

          ...(dto.email !== undefined && {
            email: dto.email,
          }),
        },
      });

      // ----------------------------------------------
      // Actualizar datos de Profesor
      // ----------------------------------------------

      const profesorActualizado = await tx.profesor.update({
        where: {
          id_profesor: id,
        },

        data: {
          ...(dto.especialidad !== undefined && {
            especialidad: dto.especialidad,
          }),

          ...(dto.fecha_contratacion !== undefined && {
            fecha_contratacion: new Date(dto.fecha_contratacion),
          }),
        },
      });

      // ----------------------------------------------
      // Respuesta
      // ----------------------------------------------

      return {
        id_profesor: profesorActualizado.id_profesor,
        especialidad: profesorActualizado.especialidad,
        fecha_contratacion: profesorActualizado.fecha_contratacion,

        usuario: {
          id_usuario: usuario.id_usuario,
          primer_nombre: usuario.primer_nombre,
          segundo_nombre: usuario.segundo_nombre,
          primer_apellido: usuario.primer_apellido,
          segundo_apellido: usuario.segundo_apellido,
          email: usuario.email,
          rol: usuario.rol,
          estado: usuario.estado,
        },
      };
    });
  }

  // --------------------------------------------------
  // ELIMINAR UN PROFESOR
  // --------------------------------------------------

  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      // Primero buscamos el profesor para obtener
      // el usuario relacionado.

      const profesor = await tx.profesor.findUnique({
        where: {
          id_profesor: id,
        },
      });

      if (!profesor) {
        throw new NotFoundException('Profesor no encontrado');
      }

      // Eliminamos primero el perfil de profesor.
      await tx.profesor.delete({
        where: {
          id_profesor: id,
        },
      });

      // Después eliminamos el usuario.
      await tx.usuario.delete({
        where: {
          id_usuario: profesor.id_usuario,
        },
      });

      return {
        message: 'Profesor eliminado correctamente',
        id_profesor: id,
      };
    });
  }
}
