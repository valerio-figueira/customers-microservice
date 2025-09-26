import { DocumentInterface } from './document.interface';
import { Document } from '../document.entity';

export interface DocumentPolicyInterface {
  ensureCustomerExists(customerId: string): Promise<void>;
  ensureDocumentIsUnique(document: DocumentInterface): Promise<void>;
  ensureDocumentsAreUnique(documents: Document[]): Promise<void>
  ensureDocumentTypeIsUnique(document: DocumentInterface): Promise<void>;
}
