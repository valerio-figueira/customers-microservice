import { Address } from './address.entity';
import { Document } from './document.entity';
import { Email } from './email.entity';
import { Phone } from './phone.entity';
import { Gender } from './gender.entity';
import {
  CustomerAttributes,
  CustomerInterface,
} from './interfaces/customer.interface';
import { ApplicationValidationError } from '../../app/commons/errors/errors';
import { Avatar } from './avatar.entity';
import { Password } from './password.entity';

export class Customer implements CustomerInterface {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _email: Email;
  private readonly _password: Password;
  private readonly _phone: Phone;
  private readonly _gender: Gender;
  private readonly _dateOfBirth: Date;
  private readonly _documents: Document[];
  private readonly _avatar: Avatar;
  private readonly _addresses: Address[];

  constructor(attr: CustomerAttributes) {
    this._id = attr.id;
    this._name = attr.name;
    this._email = attr.email;
    this._password = attr.password;
    this._phone = attr.phone;
    this._gender = attr.gender;
    this._dateOfBirth = attr.dateOfBirth;
    this._documents = attr.documents || [];
    this._avatar = attr.avatar || new Avatar();
    this._addresses = attr.addresses || [];
    Object.freeze(this);
  }

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

  public get password(): Password {
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

  public get avatar(): Avatar {
    return this._avatar;
  }

  public get avatarPath(): string | null {
    return this._avatar.path;
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
