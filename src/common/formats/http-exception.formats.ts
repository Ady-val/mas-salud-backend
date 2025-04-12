import { HttpException } from '@nestjs/common';

interface ExceptionObj {
  field: string;
  error: string;
}

export const CustomHttpException = (
  err: string | ExceptionObj | ExceptionObj[],
  statusCode: number,
) => {
  if (typeof err === 'string') {
    return new HttpException(
      {
        field: 'Error',
        error: err,
      },
      400,
    );
  }

  if (Array.isArray(err)) {
    return new HttpException(err, statusCode);
  }

  return new HttpException([err], statusCode);
};
