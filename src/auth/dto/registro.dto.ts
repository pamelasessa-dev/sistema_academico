export class RegistroDto {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;

  email: string;
  password: string;

  telefono?: string;
  direccion?: string;

  tutor_nombre: string;
  tutor_apellido: string;
  tutor_parentesco: string;
  tutor_telefono: string;
  tutor_email?: string;
  tutor_direccion?: string;
}
