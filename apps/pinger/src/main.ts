import { NestFactory } from '@nestjs/core';
import { AppModule } from './appModule';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Pinger')
    .setDescription('Allows for distributed, modern, pinging. WOW!')
    .setVersion('1.0')
    .addTag('pings')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.port ?? 3000);
}

bootstrap();
