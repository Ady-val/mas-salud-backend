import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { HTTP_MESSAGES } from 'common/constants/http-messages.constants';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message: string | string[] | object = HTTP_MESSAGES.SERVER_ERROR.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      console.log('res', res);
      message = res;
      // message = typeof res === 'string' ? res : (res as { message: string | string[] }).message || message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (status === 500) {
      response.status(status).json({
        statusCode: status,
        message: 'Server error',
        path: request.url,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
