import {
  DocumentInterface,
  PersistedDocumentInterface,
} from '../../domain/entities/interfaces/document.interface';

export class DocumentMapper {
  /**
   * Converte um Document de domínio em um objeto persistido.
   */
  static toPersistence(
    document: DocumentInterface,
  ): Omit<PersistedDocumentInterface, 'isExpired'> {
    return {
      id: document.id,
      customerId: document.customerId,
      type: document.type,
      value: document.value,
      issuingAuthority: document.issuingAuthority ?? null,
      issueDate: document.issueDate ?? null,
      expirationDate: document.expirationDate ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }
}
