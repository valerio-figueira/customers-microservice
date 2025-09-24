export class RepositoryInternalError extends Error {
  public readonly code = 'REPOSITORY_INTERNAL_ERROR';

  constructor(message: string = 'Erro interno de persistência') {
    super(message);
  }
}
