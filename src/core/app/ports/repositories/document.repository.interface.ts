import {
  DocumentInterface,
  PersistedDocumentInterface,
} from '../../../domain/entities/interfaces/document.interface';

export type FindOneDocumentOptions = {
  id: string;
  customerId?: string;
};

export interface DocumentRepositoryInterface {
  save(document: DocumentInterface): Promise<PersistedDocumentInterface>;
  exists(document: string): Promise<boolean>;
  findDocument(value: string): Promise<PersistedDocumentInterface | null>;
  findOneOrThrow(
    options: FindOneDocumentOptions,
  ): Promise<PersistedDocumentInterface>;
  findByCustomerAndType(customerId: string, type: string): Promise<boolean>;
}
