import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PingsController } from './pings.controller';
import { PingsService } from './pings.service';
import { valkeyPingsRepositoryProvider } from './pings.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

/**
 * Injection token for the RabbitMQ client.
 */
export const PINGER_CLIENT = Symbol('RABBIT_MQ_CLIENT');

/**
 * ClientsModule configured for this application.
 */
const microservicesClientModules = ClientsModule.registerAsync([
  {
    name: PINGER_CLIENT,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const logger = new Logger('rabbitMqInitializer');
      logger.debug('initializing microservice client module with RabbitMq');
      const rabbitMqUrl =
        config.get<string>('RABBITMQ_URL') ??
        'amqp://guest:guest@localhost:5672';
      return {
        transport: Transport.RMQ,
        options: {
          urls: [rabbitMqUrl],
          prefetchCount: 2,
          queue: 'pinger_queue',
          queueOptions: {
            durable: false,
          },
          persistent: true,
        },
      };
    },
  },
]);

@Module({
  imports: [ConfigModule, microservicesClientModules],
  controllers: [PingsController],
  providers: [PingsService, valkeyPingsRepositoryProvider],
})
export class PingsModule {}
