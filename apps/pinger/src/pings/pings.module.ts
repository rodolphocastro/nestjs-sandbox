import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PingsController } from './pings.controller';
import { PingsService } from './pings.service';

@Module({
  imports: [ConfigModule],
  controllers: [PingsController],
  providers: [PingsService],
})
export class PingsModule {}
