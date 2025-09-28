import {
  CreateDocumentInput,
  CreateDocumentOutput,
} from '../create-document/create-document.interface';
import { GenderEnum } from '../../../domain/enums/gender.enum';
import { GenderInterface } from '../../../domain/entities/value-objects/interfaces/gender.interface';
import { EmailInterface } from '../../../domain/entities/value-objects/email.vo';
import { DateOfBirthInterface } from '../../../domain/entities/value-objects/interfaces/date-of-birth.interface';
import { PhoneInterface } from '../../../domain/entities/value-objects/interfaces/phone.interface';

export interface CreateCustomerInterface {
  create: (input: CreateCustomerInput) => Promise<CreateCustomerOutput>;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: GenderEnum;
  dateOfBirth: Date;
  documents: Omit<CreateDocumentInput, 'customerId'>[];
}

export interface CreateCustomerOutput {
  id: string;
  name: string;
  email: EmailInterface;
  phone: PhoneInterface;
  gender: GenderInterface;
  dateOfBirth: DateOfBirthInterface;
  documents: CreateDocumentOutput[];
}
