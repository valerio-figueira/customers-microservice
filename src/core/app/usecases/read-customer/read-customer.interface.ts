import { ReadDocumentOutput } from '../read-document/read-document.interface';
import { EmailInterface } from '../../../domain/entities/value-objects/email.vo';
import { PhoneInterface } from '../../../domain/entities/value-objects/interfaces/phone.interface';
import { GenderInterface } from '../../../domain/entities/value-objects/interfaces/gender.interface';
import { DateOfBirthInterface } from '../../../domain/entities/value-objects/interfaces/date-of-birth.interface';

export interface ReadOneCustomerOutput {
  id: string;
  name: string;
  email: EmailInterface;
  phone: PhoneInterface;
  gender: GenderInterface;
  dateOfBirth: DateOfBirthInterface;
  documents: ReadDocumentOutput[];
}

export interface ReadOneCustomerUseCaseInterface {
  readOne(customerId: string): Promise<ReadOneCustomerOutput>;
}
