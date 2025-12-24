import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { valkeyProvider } from './infra.providers';
import Valkey from 'iovalkey';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [valkeyProvider],
  exports: [Valkey],
})
export class InfrastructureModule {}
