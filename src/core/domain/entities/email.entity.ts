import { ApplicationValidationError } from '../../app/commons/errors/errors';

export class Email {
  public readonly value: string;

  constructor(value: string) {
    if (!Email.isValid(value)) {
      throw new ApplicationValidationError('Email inválido.');
    }
    this.value = value;
  }

  private static isValid(value: string): boolean {
    const regex = /^[^\s@]{4,}@[^\s@.]{3,}\.[^\s@]{2,}$/;
    return regex.test(value);
  }
}
