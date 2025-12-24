import { NestFactory } from '@nestjs/core';
import { PingerModule } from './pinger.module';

async function bootstrap() {
  const app = await NestFactory.create(PingerModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
