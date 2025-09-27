import {
  DocumentInterface,
  PersistedDocumentInterface,
} from '../../core/domain/entities/interfaces/document.interface';
import { PersistedCustomerInterface } from '../../core/domain/entities/interfaces/customer.interface';

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

  static fromDynamo(
    document: PersistedDocumentInterface,
  ): Omit<PersistedDocumentInterface, 'isExpired'> {
    return {
      id: document.id,
      customerId: document.customerId,
      type: document.type,
      value: document.value,
      issueDate: document.issueDate,
      issuingAuthority: document.issuingAuthority,
      expirationDate: document.expirationDate,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      deletedAt: document.deletedAt,
    };
  }
}
