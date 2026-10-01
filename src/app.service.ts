import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'sistema_academico',
      status: 'ok',
    };
  }
}