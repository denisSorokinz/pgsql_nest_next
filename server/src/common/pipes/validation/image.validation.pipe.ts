import {
  ArgumentMetadata,
  HttpException,
  HttpExceptionBody,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import * as sharp from 'sharp';

export class ImageValidationPipe extends ValidationPipe {
  public async transform(
    image: Express.Multer.File,
    metadata: ArgumentMetadata,
  ) {
    try {
      await super.transform(image, metadata);

      const { width, height } = await sharp(image.buffer).metadata();

      if (!(width >= 70 && height >= 70))
        throw new UnprocessableEntityException(
          'Photo dimensions should be at least 70x70 px.',
        );

      return image;
    } catch (e) {
      if (e instanceof HttpException) {
        const validationErrors = (e.getResponse() as HttpExceptionBody).message;

        throw new UnprocessableEntityException(validationErrors);
      }
    }
  }
}
