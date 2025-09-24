import { ApplicationError } from './application-error.interface';

export class ApplicationNotFoundError
  extends Error
  implements ApplicationError
{
  public readonly code: string = 'NOT_FOUND';

  constructor(message: string = 'Not Found') {
    super(message);
  }
}
