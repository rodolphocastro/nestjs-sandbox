import { Injectable } from '@nestjs/common';

@Injectable()
export class PingerService {
  getHello(): string {
    return 'Hello World!';
  }
}
