import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoUsuario } from '../../generated/prisma/enums.js';

export class UpdateUsuarioEstadoDto {
  @ApiProperty({
    enum: EstadoUsuario,
    example: EstadoUsuario.ACTIVO,
    description: 'Nuevo estado del usuario',
  })
  @IsEnum(EstadoUsuario, {
    message: 'El estado debe ser PENDIENTE, ACTIVO, SUSPENDIDO o INACTIVO',
  })
  estado!: EstadoUsuario;
}