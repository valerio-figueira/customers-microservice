import { DocumentTypeEnum } from '../../../../domain/enums/document-type.enum';

export interface CreateDocumentUseCaseInterface {
  createMany: (input: CreateDocumentInput[]) => Promise<CreateDocumentOutput[]>;
}

export interface CreateDocumentInput {
  type: DocumentTypeEnum;
  value: string;
  issuingAuthority: string | null;
  issueDate: Date | null;
  expirationDate: Date | null;
}

export interface CreateDocumentOutput {
  id: string;
  customerId: string;
  type: DocumentTypeEnum | 'CPF' | 'RG' | 'CNPJ' | 'CNH' | 'PASSPORT';
  value: string;
  issuingAuthority: string | null;
  issueDate: Date | null;
  expirationDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
