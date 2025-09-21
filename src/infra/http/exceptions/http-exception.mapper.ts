import {
  ApplicationNotFoundError,
  ApplicationConflictError,
  ApplicationValidationError,
  ApplicationInternalError,
} from '../../../core/app/commons/errors/errors';
import { Logger, NotFoundException } from '@nestjs/common';

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

    if (error instanceof NotFoundException) {
      return { status: 404, message: error.message };
    }

    // fallback para erros não mapeados
    if (error instanceof Error) {
      new Logger(error.message);
    }

    return {
      status: 500,
      message: 'Erro interno de servidor.',
    };
  }
}
