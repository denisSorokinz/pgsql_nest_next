import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpExceptionBody,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import mapValidationErrorResponse from '../utils/mapValidationErrorResponse';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    let body = { success: false, message: exception.message } as any;

    if (exception instanceof UnprocessableEntityException) {
      const response = exception.getResponse() as HttpExceptionBody;
      const errorBody = response.message as any;

      body.message = 'Validation failed';

      // todo: separate error codes for primitive / file exceptions
      body.fails =
        typeof errorBody === 'string'
          ? [{ photo: errorBody }]
          : mapValidationErrorResponse(errorBody as ValidationError[]);
    }

    console.dir({ body }, { depth: 5 });

    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json(body);
  }
}
