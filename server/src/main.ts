import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DTOValidationPipe } from './common/pipes/validation/dto.validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { join } from 'path';

const PORT = 8000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix(process.env.API_PATH);
  app.useGlobalPipes(
    new DTOValidationPipe({
      exceptionFactory(errors) {
        return new BadRequestException(errors);
      },
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(PORT);
}
bootstrap();
