import {
  ApplicationNotFoundError,
  ApplicationConflictError,
  ApplicationValidationError,
  ApplicationInternalError,
  ApplicationError,
} from '../../../core/app/commons/errors/errors';
import { Logger } from '@nestjs/common';

type HttpErrorResponse = { status: number; instance: ApplicationError };

export class HttpErrorMapper {
  static toHttp(error: unknown): HttpErrorResponse {
    if (error instanceof ApplicationNotFoundError) {
      return { status: 404, instance: error };
    }

    if (error instanceof ApplicationConflictError) {
      return { status: 409, instance: error };
    }

    if (error instanceof ApplicationValidationError) {
      return { status: 400, instance: error };
    }

    if (error instanceof ApplicationInternalError) {
      return { status: 500, instance: error };
    }

    // fallback para erros não mapeados
    if (error instanceof Error) {
      new Logger(error.message);
    }

    return {
      status: 500,
      instance: {
        code: 'UNEXPECTED_ERROR',
        message: 'Erro interno de servidor.',
      },
    };
  }
}
