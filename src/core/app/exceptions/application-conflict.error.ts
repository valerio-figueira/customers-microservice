import { ApplicationError } from './application-error.interface';

export class ApplicationConflictError
  extends Error
  implements ApplicationError
{
  public readonly code: string = 'CONFLICT';

  constructor(message: string = 'Conflict occurred') {
    super(message);
  }
}
