import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpErrorMapper } from './http-error.mapper';

@Catch()
export class ApplicationErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const { status, instance } = HttpErrorMapper.toHttp(exception);

    res.status(status).json({
      status,
      code: instance.code,
      message: instance.message,
    });
  }
}
