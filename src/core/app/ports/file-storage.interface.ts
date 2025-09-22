export interface FileStorageInterface {
  /**
   * Faz upload de um arquivo binário ou buffer/string.
   * @param key Identificador único do arquivo (ex.: 'profiles/user-123.jpg')
   * @param content Conteúdo do arquivo (Buffer, string base64, ou stream)
   * @param options Metadados opcionais como contentType, ACL etc.
   */
  upload(
    key: string,
    content: Buffer | string,
    options?: { contentType?: string },
  ): Promise<void>;

  /**
   * Remove um arquivo.
   * @param key Identificador do arquivo
   */
  delete(key: string): Promise<void>;
}
