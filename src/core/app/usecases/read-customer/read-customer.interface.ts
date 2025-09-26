import { ReadDocumentOutput } from '../read-document/read-document.interface';
import { GenderType } from '../../../domain/entities/interfaces/customer.interface';

export interface ReadOneCustomerOutput {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: GenderType;
  dateOfBirth: Date;
  documents: ReadDocumentOutput[];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface ReadOneCustomerUseCaseInterface {
  readOne(customerId: string): Promise<ReadOneCustomerOutput>;
}
