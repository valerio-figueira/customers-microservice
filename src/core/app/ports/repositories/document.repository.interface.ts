import { DocumentInterface } from '../../../domain/entities/interfaces/document.interface';

export interface DocumentRepositoryInterface {
  save(document: DocumentInterface): Promise<{ id: string }>;
  exists(document: string): Promise<boolean>;
}
