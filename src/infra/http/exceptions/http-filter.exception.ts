import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionMapper } from './http-exception.mapper';

@Catch()
export class ApplicationErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const { status, message } = HttpExceptionMapper.toHttp(exception);

    new Logger().error(
      `[Customers Microservice] EXCEPTION: ${JSON.stringify({ status, message })}`,
    );

    res.status(status).json({
      status,
      message,
    });
  }
}
