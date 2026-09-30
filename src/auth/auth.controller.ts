import {
  Controller,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService){}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(
    @Request() 
    req: { 
      user:{
        id_usuario:number;
        email:string;
        rol:string;
        estado:string;
      };
    },
  ) {
    return this.authService.login(req.user);
  }
}