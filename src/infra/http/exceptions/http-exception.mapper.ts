import {
  ApplicationNotFoundError,
  ApplicationConflictError,
  ApplicationValidationError,
  ApplicationInternalError,
} from '../../../core/app/commons/errors/errors';
import { HttpException, Logger } from '@nestjs/common';

type HttpErrorResponse = { status: number; message: string };

export class HttpExceptionMapper {
  static toHttp(error: unknown): HttpErrorResponse {
    if (error instanceof ApplicationNotFoundError) {
      return { status: 404, message: error.message };
    }

    if (error instanceof ApplicationConflictError) {
      return { status: 409, message: error.message };
    }

    if (error instanceof ApplicationValidationError) {
      return { status: 400, message: error.message };
    }

    if (error instanceof ApplicationInternalError) {
      return { status: 500, message: error.message };
    }

    // Erros do NestJS
    if (error instanceof HttpException) {
      const status = error.getStatus();
      const message = error?.message || 'Erro HTTP';
      return { status, message };
    }

    new Logger().error(
      `[Customers Microservice] EXCEPTION NOT MAPPED: ${JSON.stringify(error)}`,
    );

    // fallback para erros não mapeados
    return {
      status: 500,
      message: 'Erro interno de servidor.',
    };
  }
}
