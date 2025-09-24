import { DomainError } from './domain-error.interface';

export class DomainDateOfBirthError extends Error implements DomainError {
  public readonly code: string = 'DATE_OF_BIRTH_ERROR';

  constructor(message: string = 'Data de nascimento é inválida') {
    super(message);
  }
}
