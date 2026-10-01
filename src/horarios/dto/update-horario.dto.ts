import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DiaSemana } from '../../generated/prisma/enums.js';

export class UpdateHorarioDto {
  @ApiPropertyOptional({
    description: 'Día de la semana en el que se dicta la clase.',
    enum: DiaSemana,
    example: DiaSemana.MARTES,
  })
  @IsOptional()
  @IsEnum(DiaSemana, {
    message:
      'El día de la semana debe ser LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO o DOMINGO',
  })
  dia_semana?: DiaSemana;

  @ApiPropertyOptional({
    description: 'Hora de inicio del horario en formato HH:mm.',
    example: '14:00',
  })
  @IsOptional()
  @IsString({
    message: 'La hora de inicio debe ser una cadena de texto',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de inicio debe tener el formato HH:mm',
  })
  hora_inicio?: string;

  @ApiPropertyOptional({
    description: 'Hora de finalización del horario en formato HH:mm.',
    example: '16:00',
  })
  @IsOptional()
  @IsString({
    message: 'La hora de finalización debe ser una cadena de texto',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de finalización debe tener el formato HH:mm',
  })
  hora_fin?: string;
}