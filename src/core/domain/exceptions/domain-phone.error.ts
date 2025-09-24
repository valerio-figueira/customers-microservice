import { DomainError } from './domain-error.interface';

export class DomainPhoneError extends Error implements DomainError {
  public readonly code: string = 'PHONE_ERROR';

  constructor(message: string = 'O telefone não é válido') {
    super(message);
  }
}
