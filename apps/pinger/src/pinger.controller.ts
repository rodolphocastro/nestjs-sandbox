import { Controller, Get } from '@nestjs/common';
import { PingerService } from './pinger.service';

@Controller()
export class PingerController {
  constructor(private readonly pingerService: PingerService) {}

  @Get()
  getHello(): string {
    return this.pingerService.getHello();
  }
}
