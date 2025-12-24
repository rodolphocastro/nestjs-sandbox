import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PingsModule } from './pings/pings.module';

@Module({
  imports: [ConfigModule.forRoot(), PingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
