import {
  DocumentInterface,
  PersistedDocumentInterface,
} from '../../../domain/entities/interfaces/document.interface';

export interface DocumentRepositoryInterface {
  save(document: DocumentInterface): Promise<PersistedDocumentInterface>;
  exists(document: string): Promise<boolean>;
  findDocument(value: string): Promise<PersistedDocumentInterface | null>;
  findByIdOrThrow(id: string): Promise<PersistedDocumentInterface>;
  findByCustomerAndType(customerId: string, type: string): Promise<boolean>;
}
