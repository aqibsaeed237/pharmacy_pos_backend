import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): object {
    return {
      message: 'Pharmacy POS Backend API',
      version: this.configService.get<string>('app.version'),
      environment: this.configService.get<string>('app.env'),
    };
  }
}
