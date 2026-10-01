import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MatriculasService } from './matriculas.service.js';
import { CreateMatriculaDto } from './dto/create-matricula.dto.js';

import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { RolUsuario } from '../generated/prisma/enums.js';

@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly matriculasService: MatriculasService) {}

   @Get('mis-matriculas')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolUsuario.ESTUDIANTE)
  async findMyEnrollments(
    @Req() request: { user: { sub: number } },
  ) {
    return this.matriculasService.findMyEnrollments(request.user.sub);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolUsuario.ESTUDIANTE)
  async create(
    @Req() request: { user: { sub: number } },
    @Body() dto: CreateMatriculaDto,
  ) {
    return this.matriculasService.create(request.user.sub, dto);
  }

}