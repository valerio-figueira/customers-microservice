import {
  DocumentInterface,
  PersistedDocumentInterface,
} from '../../core/domain/entities/interfaces/document.interface';

export class DocumentMapper {
  /**
   * Converte um Document de domínio em um objeto persistido.
   */
  static toPersistence(
    document: DocumentInterface,
  ): Omit<
    PersistedDocumentInterface,
    'isExpired' | 'deletedAt' | 'updatedAt' | 'createdAt'
  > {
    return {
      id: document.id,
      customerId: document.customerId,
      type: document.type,
      value: document.value,
      issuingAuthority: document.issuingAuthority ?? null,
      issueDate: document.issueDate ?? null,
      expirationDate: document.expirationDate ?? null,
    };
  }
}
