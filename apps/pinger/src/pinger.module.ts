import { Module } from '@nestjs/common';
import { PingerController } from './pinger.controller';
import { PingerService } from './pinger.service';

@Module({
  imports: [],
  controllers: [PingerController],
  providers: [PingerService],
})
export class PingerModule {}
