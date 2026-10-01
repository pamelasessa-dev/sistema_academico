import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { DiaSemana } from '../../generated/prisma/enums.js';

export class CreateHorarioDto {
  @ApiProperty({
    description: 'ID del grupo al que pertenece el horario.',
    example: 1,
  })
  @IsInt({
    message: 'El ID del grupo debe ser un número entero',
  })
  @Min(1, {
    message: 'El ID del grupo debe ser mayor o igual a 1',
  })
  id_grupo: number;

  @ApiProperty({
    description: 'Día de la semana en el que se dicta la clase.',
    enum: DiaSemana,
    example: DiaSemana.LUNES,
  })
  @IsEnum(DiaSemana, {
    message:
      'El día de la semana debe ser LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO o DOMINGO',
  })
  dia_semana: DiaSemana;

  @ApiProperty({
    description: 'Hora de inicio del horario en formato HH:mm.',
    example: '08:00',
  })
  @IsString({
    message: 'La hora de inicio debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La hora de inicio es obligatoria',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de inicio debe tener el formato HH:mm',
  })
  hora_inicio: string;

  @ApiProperty({
    description: 'Hora de finalización del horario en formato HH:mm.',
    example: '10:00',
  })
  @IsString({
    message: 'La hora de finalización debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La hora de finalización es obligatoria',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de finalización debe tener el formato HH:mm',
  })
  hora_fin: string;
}