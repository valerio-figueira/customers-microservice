import { DomainError } from './domain-error.interface';

export class DomainAddressError extends Error implements DomainError {
  public readonly code: string = 'ADDRESS_ERROR';

  constructor(message: string = 'Dados do endereço inválidos') {
    super(message);
  }
}
