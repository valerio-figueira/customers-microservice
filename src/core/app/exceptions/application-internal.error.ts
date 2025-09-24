import { ApplicationError } from './application-error.interface';

export class ApplicationInternalError
  extends Error
  implements ApplicationError
{
  public readonly code: string = 'INTERNAL_ERROR';

  constructor(message: string = 'Unexpected error occurred') {
    super(message);
  }
}
