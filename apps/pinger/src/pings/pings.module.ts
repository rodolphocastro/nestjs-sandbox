import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PingsController } from './pings.controller';
import { PingsService } from './pings.service';
import { valkeyPingsRepositoryProvider } from './pings.repository';

@Module({
  imports: [ConfigModule],
  controllers: [PingsController],
  providers: [PingsService, valkeyPingsRepositoryProvider],
})
export class PingsModule {}
