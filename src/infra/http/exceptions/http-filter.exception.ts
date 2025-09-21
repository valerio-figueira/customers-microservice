import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionMapper } from './http-exception.mapper';

@Catch()
export class ApplicationErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const { status, message } = HttpExceptionMapper.toHttp(exception);

    res.status(status).json({
      status,
      message,
    });
  }
}
