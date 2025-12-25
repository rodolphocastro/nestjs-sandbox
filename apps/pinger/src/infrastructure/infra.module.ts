import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuredCacheModule, valkeyProvider } from './infra.providers';
import Valkey from 'iovalkey';

@Global()
@Module({
  imports: [ConfigModule, configuredCacheModule],
  controllers: [],
  providers: [valkeyProvider],
  exports: [Valkey],
})
export class InfrastructureModule {}
