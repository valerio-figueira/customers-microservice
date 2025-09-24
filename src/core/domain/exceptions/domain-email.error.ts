import { DomainError } from './domain-error.interface';

export class DomainEmailError extends Error implements DomainError {
  public readonly code: string = 'EMAIL_ERROR';

  constructor(message: string = 'O e-mail não é válido') {
    super(message);
  }
}
