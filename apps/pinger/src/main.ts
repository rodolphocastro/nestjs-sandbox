import { NestFactory } from '@nestjs/core';
import { AppModule } from './appModule';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  logger.log('initializing pinger');
  const app = await NestFactory.create(AppModule);

  const targetPort = app.get(ConfigService).get<number>('port') ?? 3000;
  logger.debug(`target port is ${targetPort}`);

  logger.debug('setting up swagger');
  const config = new DocumentBuilder()
    .setTitle('Pinger')
    .setDescription('Allows for distributed, modern, pinging. WOW!')
    .setVersion('1.0')
    .addTag('pings')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  logger.debug(`listening on port ${targetPort}`);
  await app.listen(targetPort);
}

bootstrap();
