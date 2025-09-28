import { DateOfBirthInterface } from './interfaces/date-of-birth.interface';

export class DateOfBirth implements DateOfBirthInterface {
  private readonly _value: Date;

  constructor(date: string | Date) {
    const parsedDate = date instanceof Date ? date : new Date(date);

    if (isNaN(parsedDate.getTime())) {
      throw new Error('Data de nascimento inválida.');
    }

    const today = new Date();
    if (parsedDate > today) {
      throw new Error('Data de nascimento não pode ser no futuro.');
    }

    this._value = parsedDate;
  }

  public get value(): Date {
    return this._value;
  }

  public isOver18(): boolean {
    const today = new Date();
    let age = today.getFullYear() - this._value.getFullYear();
    const m = today.getMonth() - this._value.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this._value.getDate())) {
      age--;
    }
    return age >= 18;
  }
}
