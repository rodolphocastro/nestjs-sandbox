import { NestFactory } from '@nestjs/core';
import { AppModule } from './appModule';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<AsyncMicroserviceOptions>({
    useFactory: (config: ConfigService) => {
      const logger = new Logger('rabbitMqInitializer');
      logger.debug('initializing microservice module with RabbitMq');
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
    inject: [ConfigService],
  });

  const config = new DocumentBuilder()
    .setTitle('Pinger')
    .setDescription('Allows for distributed, modern, pinging. WOW!')
    .setVersion('1.0')
    .addTag('pings')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}

bootstrap();
