import { Email } from '../value-objects/email.vo';
import { Phone } from '../value-objects/phone.vo';
import { Gender } from '../value-objects/gender.vo';
import { Document } from '../document.entity';
import { PersistedDocumentInterface } from './document.interface';
import { GenderEnum } from '../../enums/gender.enum';
import { DocumentTypeEnum } from '../../enums/document-type.enum';
import { Avatar } from '../value-objects/avatar.vo';
import { Address } from '../address.entity';
import { Password } from '../value-objects/password.vo';
import { DateOfBirth } from '../value-objects/date-of-birth.vo';

export interface CustomerInterface {
  readonly id: string;
  readonly name: string;
  readonly email: Email;
  readonly password: Password;
  readonly phone: Phone;
  readonly gender: Gender;
  readonly dateOfBirth: DateOfBirth;
  readonly documents: Document[];
  readonly avatar: Avatar;
  readonly addresses: Address[];
}

export type CustomerAttributes = CustomerInterface;
export type GenderType = GenderEnum | 'MALE' | 'FEMALE' | 'OTHER';

export interface PersistedCustomerInterface {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly phone: string;
  readonly gender: GenderType;
  readonly dateOfBirth: Date;
  readonly documents: PersistedDocumentInterface[];
  readonly avatarPath: string | null;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly deletedAt: Date | null;
}

export interface CustomerDocumentInterface {
  type: DocumentTypeEnum;
  value: string;
  issuingAuthority: string | null;
  issueDate: Date | null;
  expirationDate: Date | null;
}
