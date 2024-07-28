import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seed.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(SeederModule);

  await new Promise((res) => setTimeout(res, 30000));
}

bootstrap();
