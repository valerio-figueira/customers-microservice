import { HttpException, Logger } from '@nestjs/common';
import { EXCEPTIONS_DICTONARY } from './http-exception.dictionary';

type HttpErrorResponse = { status: number; message: string };

export class HttpExceptionMapper {
  static toHttp(error: unknown): HttpErrorResponse {
    for (const [ErrorClass, status] of EXCEPTIONS_DICTONARY.entries()) {
      if (error instanceof ErrorClass) {
        return { status, message: error.message };
      }
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
