import { DomainError } from './domain-error.interface';

export class DomainAvatarError extends Error implements DomainError {
  public readonly code: string = 'AVATAR_ERROR';

  constructor(message: string = 'Dados do avatar inválidos') {
    super(message);
  }
}
