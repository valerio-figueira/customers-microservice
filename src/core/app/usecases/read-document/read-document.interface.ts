import { DocumentInterface } from '../../../domain/entities/interfaces/document.interface';

export interface ReadDocumentInput {
  id: string;
}

export interface ReadDocumentOutput
  extends Omit<DocumentInterface, 'isExpired'> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
