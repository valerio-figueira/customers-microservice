import { DocumentTypeEnum } from '../../enums/document-type.enum';

export interface DocumentInterface {
  readonly id: string;
  readonly customerId: string;
  readonly type: DocumentTypes;
  readonly value: string;
  readonly issuingAuthority: string | null;
  readonly issueDate: Date | null;
  readonly expirationDate: Date | null;

  /**
   * @method isExpired
   * @description
   * Verifica se o documento está expirado com base na data de expiração.
   * @returns {boolean} True se o documento estiver expirado, false caso contrário.
   */
  isExpired(): boolean;
}

export type DocumentTypes =
  | DocumentTypeEnum
  | 'CPF'
  | 'RG'
  | 'CNPJ'
  | 'CNH'
  | 'PASSPORT';

export type DocumentAttributes = Omit<DocumentInterface, 'isExpired'>;

export interface PersistedDocumentInterface
  extends Omit<DocumentInterface, 'isExpired'> {
  readonly id: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly deletedAt: Date | null;
}
