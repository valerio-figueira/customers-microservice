import { DomainEmailError } from '../../exceptions/domain-email.error';

export interface EmailInterface {
  value: string;
}

export class Email implements EmailInterface {
  public readonly value: string;

  constructor(value: string) {
    if (!Email.isValid(value)) {
      throw new DomainEmailError();
    }
    this.value = value;
  }

  private static isValid(value: string): boolean {
    const regex = /^[^\s@]{4,}@[^\s@.]{3,}\.[^\s@]{2,}$/;
    return regex.test(value);
  }
}
