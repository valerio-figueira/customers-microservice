import { DomainError } from './domain-error.interface';

export class DomainPasswordError extends Error implements DomainError {
  public readonly code: string = 'PASSWORD_ERROR';

  constructor(message: string = 'A senha não é válida') {
    super(message);
  }
}
