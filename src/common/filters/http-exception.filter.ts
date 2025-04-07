import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { HTTP_MESSAGES } from 'common/constants/http-messages.constants';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message: unknown = HTTP_MESSAGES.SERVER_ERROR.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message = typeof res === 'object' && 'message' in res ? res.message : res;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (status === 500) {
      Logger.error(message);
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
