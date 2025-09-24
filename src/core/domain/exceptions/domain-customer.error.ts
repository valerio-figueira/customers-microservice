import { DomainError } from './domain-error.interface';

export class DomainCustomerError extends Error implements DomainError {
  public readonly code: string = 'CUSTOMER_ERROR';

  constructor(message: string = 'Dados do usuário inválidos') {
    super(message);
  }
}
