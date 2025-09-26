import { Email } from '../email.entity';
import { Phone } from '../phone.entity';
import { Gender } from '../gender.entity';
import { Document } from '../document.entity';
import { PersistedDocumentInterface } from './document.interface';
import { GenderEnum } from '../../enums/gender.enum';
import { DocumentTypeEnum } from '../../enums/document-type.enum';
import { Avatar } from '../avatar.entity';
import { Address } from '../address.entity';
import { Password } from '../password.entity';

export interface CustomerInterface {
  readonly id: string;
  readonly name: string;
  readonly email: Email;
  readonly password: Password;
  readonly phone: Phone;
  readonly gender: Gender;
  readonly dateOfBirth: Date;
  readonly documents: Document[];
  readonly avatar: Avatar;
  readonly addresses: Address[];

  isOver18(): boolean;
}

export type CustomerAttributes = Omit<CustomerInterface, 'isOver18'>;
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
