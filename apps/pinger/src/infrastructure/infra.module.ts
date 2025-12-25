import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { valkeyProvider } from './infra.providers';
import Valkey from 'iovalkey';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    ConfigModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [valkeyProvider],
  exports: [Valkey],
})
export class InfrastructureModule {}
