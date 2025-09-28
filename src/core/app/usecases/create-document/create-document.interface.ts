import { DocumentTypeEnum } from '../../../domain/enums/document-type.enum';
import { DocumentInterface } from '../../../domain/entities/interfaces/document.interface';

export interface CreateDocumentUseCaseInterface {
  create: (input: CreateDocumentInput) => Promise<CreateDocumentOutput>;
}

export interface CreateDocumentInput {
  customerId: string;
  type: DocumentTypeEnum;
  value: string;
  issuingAuthority: string | null;
  issueDate: Date | null;
  expirationDate: Date | null;
}

export interface CreateDocumentOutput
  extends Omit<DocumentInterface, 'isExpired'> {
  id: string;
  customerId: string;
}
