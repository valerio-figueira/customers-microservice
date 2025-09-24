import { DomainError } from './domain-error.interface';

export class DomainGenderError extends Error implements DomainError {
  public readonly code: string = 'GENDER_ERROR';

  constructor(message: string = 'O gênero não é válido') {
    super(message);
  }
}
