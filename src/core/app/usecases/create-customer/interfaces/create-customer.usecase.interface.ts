import {
  CreateDocumentInput,
  CreateDocumentOutput,
} from '../../create-document/interfaces/create-document-usecase.interface';
import { GenderEnum } from '../../../../domain/enums/gender.enum';

export interface CreateCustomerUseCaseInterface {
  create: (input: CreateCustomerInput) => Promise<CreateCustomerOutput>;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: GenderEnum;
  dateOfBirth: Date;
  documents: CreateDocumentInput[];
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
