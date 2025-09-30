export class DynamoKeys {
  /*
   * [Main Record] - Chaves para consulta da entidade Customer no DynamoDb.
   *
   * Chaves:
   *   - PK: CUSTOMER#{customerId}
   *   - SK: METADATA#{customerId}
   */
  static customerPK = (customerId: string): string => `CUSTOMER#${customerId}`;
  static customerSK = (customerId: string): string => `METADATA#${customerId}`;

  /*
   * [Lookup Record] - E-mail do cliente
   *
   * Finalidade:
   *   - Consultar se um e-mail já está cadastrado
   *   - Não requer GSI (Global Secondary Index)
   *
   * Chaves:
   *   - PK: CUSTOMER#EMAIL#{email}
   *   - SK: UNIQUE
   */
  static customerEmailPK = (email: string): string => `CUSTOMER#EMAIL#${email}`;
  static customerEmailSK = (): string => 'UNIQUE';

  /*
   * [Main Record] - Chaves para consulta da entidade Document no DynamoDb.
   *
   * Chaves:
   *    - PK: CUSTOMER#{customerId}
   *    - SK: DOCUMENT#ID#{documentId}
   */
  static documentPK = (customerId: string): string => `CUSTOMER#${customerId}`;
  static documentSK = (documentId: string): string =>
    `DOCUMENT#ID#${documentId}`;

  /*
   * [Lookup Record] - Chaves para consulta (lookup) de documento. Utilização: se já existe um documento cadastro.
   *
   * Chaves:
   *    - PK: DOCUMENT#VALUE#{value}
   *    - SK: UNIQUE
   */
  static documentValuePK = (value: string): string => `DOCUMENT#VALUE#${value}`;
  static documentValueSK = () => 'UNIQUE';

  /*
   * [Lookup Record] - Chaves para verificar se o Customer já possui o documento por tipo.
   * RN: Não é possível que o customer tenha mais de um documento de mesmo tipo.
   *
   * Chaves:
   *    - PK: CUSTOMER#{customerId}#DOCUMENT_TYPE#{type}
   *    - SK: UNIQUE
   */
  static customerDocumentTypePK = (customerId: string, type: string): string =>
    `CUSTOMER#${customerId}#DOCUMENT_TYPE#${type}`;
  static customerDocumentTypeSK = (): string => 'UNIQUE';

  /*
   * [Lookup Record] - Chaves para consulta de documento (unique)..
   *
   * Chaves:
   *    - PK: DOCUMENT#{documentId}
   *    - SK: UNIQUE
   */
  static customerDocumentIdPK = (documentId: string): string =>
    `DOCUMENT#${documentId}`;
  static customerDocumentIdSK = (): string => 'UNIQUE';
}
