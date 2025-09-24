import { ApplicationNotFoundError } from '../../../core/app/exceptions/application-not-found.error';
import { ApplicationConflictError } from '../../../core/app/exceptions/application-conflict.error';
import { ApplicationValidationError } from '../../../core/app/exceptions/application-validation.error';
import { ApplicationInternalError } from '../../../core/app/exceptions/application-internal.error';
import { DomainGenderError } from '../../../core/domain/exceptions/domain-gender.error';
import { DomainPasswordError } from '../../../core/domain/exceptions/domain-password.error';
import { DomainPhoneError } from '../../../core/domain/exceptions/domain-phone.error';
import { DomainEmailError } from '../../../core/domain/exceptions/domain-email.error';
import { DomainDocumentError } from '../../../core/domain/exceptions/domain-document.error';
import { DomainCustomerError } from '../../../core/domain/exceptions/domain-customer.error';
import { DomainAvatarError } from '../../../core/domain/exceptions/domain-avatar.error';
import { DomainAddressError } from '../../../core/domain/exceptions/domain-address.error';
import { DomainDateOfBirthError } from '../../../core/domain/exceptions/domain-date-of-birth.error';
import { RepositoryInternalError } from '../../../core/app/exceptions/repository-internal.error';

type ErrorConstructor = new (...args: string[]) => Error;

export const EXCEPTIONS_DICTONARY = new Map<ErrorConstructor, number>([
  [ApplicationNotFoundError, 404],
  [ApplicationConflictError, 409],
  [ApplicationValidationError, 400],
  [ApplicationInternalError, 500],
  [DomainGenderError, 400],
  [DomainPasswordError, 400],
  [DomainPhoneError, 400],
  [DomainEmailError, 400],
  [DomainDocumentError, 400],
  [DomainCustomerError, 400],
  [DomainAvatarError, 400],
  [DomainAddressError, 400],
  [DomainDateOfBirthError, 400],
  [RepositoryInternalError, 500],
]);
