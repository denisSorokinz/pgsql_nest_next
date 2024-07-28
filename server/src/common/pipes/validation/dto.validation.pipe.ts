import {
  ArgumentMetadata,
  BadRequestException,
  HttpExceptionBody,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

export class DTOValidationPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        const validationErrors = (e.getResponse() as HttpExceptionBody).message;

        throw new UnprocessableEntityException(validationErrors);
      }
    }
  }
}
