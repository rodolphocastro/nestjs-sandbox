import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PingsModule } from './pings/pings.module';
import { InfrastructureModule } from './infrastructure/infra.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PingsModule,
    InfrastructureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
