export class Email {
  public readonly value: string;

  constructor(value: string) {
    if (!Email.isValid(value)) {
      throw new Error('Email inválido.');
    }
    this.value = value;
  }

  private static isValid(value: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }
}
