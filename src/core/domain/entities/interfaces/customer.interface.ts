import { Email } from '../email.entity';
import { Phone } from '../phone.entity';
import { Gender } from '../gender.entity';
import { Document } from '../document.entity';
import { PersistedDocumentInterface } from './document.interface';
import { GenderEnum } from '../../enums/gender.enum';
import { DocumentTypeEnum } from '../../enums/document-type.enum';

export interface CustomerInterface {
  readonly id: string;
  readonly name: string;
  readonly email: Email;
  readonly password: string;
  readonly phone: Phone;
  readonly gender: Gender;
  readonly dateOfBirth: Date;
  readonly documents: Document[];

  isOver18(): boolean;
}

export interface PersistedCustomerInterface {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly phone: string;
  readonly gender: GenderEnum | 'MALE' | 'FEMALE' | 'OTHER';
  readonly dateOfBirth: Date;
  readonly documents: PersistedDocumentInterface[];
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
