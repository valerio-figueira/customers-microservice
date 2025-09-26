import {
  CreateDocumentInput,
  CreateDocumentOutput,
} from '../create-document/create-document.interface';
import { GenderEnum } from '../../../domain/enums/gender.enum';

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
  email: string;
  phone: string;
  gender: GenderEnum | 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: Date;
  documents: CreateDocumentOutput[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
