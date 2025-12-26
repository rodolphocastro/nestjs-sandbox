import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Injection token for the RabbitMQ client.
 */
export const PINGER_CLIENT = Symbol('PINGER_CLIENT');

/**
 * Provider for a RabbitMQ client that allows us to publish to the Pinger queue.
 */
export const pingerClientProvider: Provider = {
  provide: PINGER_CLIENT,
  useFactory: (config: ConfigService) => {
    const logger = new Logger('pingerClientProvider');
    logger.debug('initializing RabbitMq client for pinger');
    const url =
      config.get<string>('RABBITMQ_URL') ?? 'amqp://guest:guest@localhost:5672';
    logger.debug(`connection will be attempted on ${url}`);
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: 'pinger',
        queueOptions: {
          durable: false,
        },
        persistent: true,
      },
    });
  },
  inject: [ConfigService],
};
