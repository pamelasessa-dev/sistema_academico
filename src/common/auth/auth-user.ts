import { RolUsuario } from '../../generated/prisma/enums.js';

export interface AuthUser {
  id_usuario: number;
  email: string;
  rol: RolUsuario;
}