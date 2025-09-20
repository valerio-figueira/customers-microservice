export interface ApplicationError {
  readonly code: string;
  readonly message: string;
}

export class ApplicationNotFoundError
  extends Error
  implements ApplicationError
{
  public readonly code: string = 'NOT_FOUND';

  constructor(message: string = 'Not Found') {
    super(message);
  }
}

export class ApplicationConflictError
  extends Error
  implements ApplicationError
{
  public readonly code: string = 'CONFLICT';

  constructor(message: string = 'Conflict occurred') {
    super(message);
  }
}

export class ApplicationValidationError
  extends Error
  implements ApplicationError
{
  public readonly code: string = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
  }
}

export class ApplicationInternalError
  extends Error
  implements ApplicationError
{
  public readonly code: string = 'INTERNAL_ERROR';

  constructor(message: string = 'Unexpected error occurred') {
    super(message);
  }
}
