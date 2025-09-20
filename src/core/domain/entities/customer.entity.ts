import { Address } from './address.entity';
import { Document } from './document.entity';
import { Email } from './email.entity';
import { Phone } from './phone.entity';
import { Gender } from './gender.entity';
import { CustomerInterface } from './interfaces/customer.interface';
import { ApplicationValidationError } from '../../app/commons/errors/errors';

export class Customer implements CustomerInterface {
  private readonly _addresses: Address[] = [];

  constructor(
    private _id: string,
    private readonly _name: string,
    private readonly _email: Email,
    private readonly _password: string,
    private readonly _phone: Phone,
    private readonly _gender: Gender,
    private readonly _dateOfBirth: Date,
    private readonly _documents: Document[] = [],
  ) {}

  public get id(): string {
    if (!this._id) {
      throw new ApplicationValidationError('Customer id is empty.');
    }
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): Email {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }

  public get phone(): Phone {
    return this._phone;
  }

  public get gender(): Gender {
    return this._gender;
  }

  public get dateOfBirth(): Date {
    return this._dateOfBirth;
  }

  public get addresses(): Address[] {
    return this._addresses;
  }

  public get documents(): Document[] {
    return this._documents;
  }

  public isOver18(): boolean {
    const today = new Date();
    const birthDate = new Date(this._dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }
}
