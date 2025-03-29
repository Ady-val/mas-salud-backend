import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HTTP_MESSAGES } from 'app/constants/http-messages.constants';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const status = (exception?.status || 500) as number;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const message = (exception?.response?.message ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      exception?.message ||
      HTTP_MESSAGES.SERVER_ERROR.INTERNAL_SERVER_ERROR) as string;

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });

    // Si la ruta no existe, el estado es 404
    // if (status === 404) {
    //   response.status(status).json({
    //     statusCode: status,
    //     message: 'Route not found',
    //     path: request.url,
    //   });
    // } else {
    //   response.status(status).json({
    //     statusCode: status,
    //     message,
    //     path: request.url,
    //     timestamp: new Date().toISOString(),
    //   });
    // }
  }
}
