import { ApplicationError } from './application-error.interface';

export class ApplicationValidationError
  extends Error
  implements ApplicationError
{
  public readonly code: string = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
  }
}
