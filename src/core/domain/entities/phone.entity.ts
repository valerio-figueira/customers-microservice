import { DomainPhoneError } from '../exceptions/domain-phone.error';

export class Phone {
  public readonly value: string;

  constructor(value: string) {
    const cleaned = Phone.clean(value);

    if (!Phone.isValid(cleaned)) {
      throw new DomainPhoneError();
    }

    this.value = cleaned;
  }

  private static clean(value: string): string {
    return value.replace(/\D/g, '');
  }

  private static isValid(value: string): boolean {
    // considera telefones com 10 a 14 dígitos
    return /^\d{10,14}$/.test(value);
  }

  public formatted(): string {
    const raw = this.value;

    if (raw.length === 11) {
      return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }

    if (raw.length === 10) {
      return `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
    }

    // Fallback
    return raw;
  }
}
