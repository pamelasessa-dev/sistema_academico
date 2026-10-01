import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateMatriculaDto {
  @ApiProperty({
    description: 'ID del grupo al que el estudiante desea matricularse.',
    example: 1,
  })
  @IsInt({
    message: 'El ID del grupo debe ser un número entero',
  })
  @Min(1, {
    message: 'El ID del grupo debe ser mayor o igual a 1',
  })
  id_grupo: number;
}