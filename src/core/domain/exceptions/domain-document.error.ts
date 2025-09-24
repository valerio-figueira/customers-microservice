import { DomainError } from './domain-error.interface';

export class DomainDocumentError extends Error implements DomainError {
  public readonly code: string = 'DOCUMENT_ERROR';

  constructor(message: string = 'O documento não é válido') {
    super(message);
  }
}
