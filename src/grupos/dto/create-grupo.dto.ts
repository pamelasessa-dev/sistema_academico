import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoGrupo } from '../../generated/prisma/enums.js';

export class CreateGrupoDto {
  @ApiProperty({
    description: 'ID de la materia que corresponde al grupo.',
    example: 1,
  })
  @IsInt({
    message: 'El ID de la materia debe ser un número entero',
  })
  @Min(1, {
    message: 'El ID de la materia debe ser mayor o igual a 1',
  })
  id_materia: number;

  @ApiProperty({
    description: 'ID del período académico al que pertenece el grupo.',
    example: 1,
  })
  @IsInt({
    message: 'El ID del período debe ser un número entero',
  })
  @Min(1, {
    message: 'El ID del período debe ser mayor o igual a 1',
  })
  id_periodo: number;

  @ApiProperty({
    description: 'ID del profesor responsable del grupo.',
    example: 1,
  })
  @IsInt({
    message: 'El ID del profesor debe ser un número entero',
  })
  @Min(1, {
    message: 'El ID del profesor debe ser mayor o igual a 1',
  })
  id_profesor: number;

  @ApiProperty({
    description: 'ID del aula asignada al grupo.',
    example: 1,
  })
  @IsInt({
    message: 'El ID del aula debe ser un número entero',
  })
  @Min(1, {
    message: 'El ID del aula debe ser mayor o igual a 1',
  })
  id_aula: number;

  @ApiProperty({
    description: 'Nombre identificador del grupo.',
    example: 'Grupo A - Turno matutino',
  })
  @Transform(({ value }) => value?.trim())
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El nombre es obligatorio',
  })
  @MinLength(2, {
    message: 'El nombre debe tener al menos 2 caracteres',
  })
  @Matches(/\S/, {
    message: 'El nombre no puede contener solo espacios',
  })
  nombre: string;

  @ApiProperty({
    description:
      'Cantidad máxima de estudiantes que puede tener el grupo.',
    example: 30,
  })
  @IsInt({
    message: 'El cupo máximo debe ser un número entero',
  })
  @Min(1, {
    message: 'El cupo máximo debe ser mayor o igual a 1',
  })
  cupo_maximo: number;

  @ApiProperty({
    description: 'Estado actual del grupo.',
    enum: EstadoGrupo,
    example: EstadoGrupo.ABIERTO,
  })
  @IsEnum(EstadoGrupo, {
    message: 'El estado debe ser ABIERTO, CERRADO o FINALIZADO',
  })
  estado: EstadoGrupo;
}