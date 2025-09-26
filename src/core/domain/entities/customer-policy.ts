import { DomainEmailError } from '../exceptions/domain-email.error';
import { RepositoryFactoryInterface } from '../../app/ports/unit-of-work.interface';
import { CustomerPolicyInterface } from './interfaces/customer-policy.interface';

export class CustomerPolicy implements CustomerPolicyInterface {
  constructor(private readonly repositories: RepositoryFactoryInterface) {}

  public async ensureEmailIsUnique(email: string): Promise<void> {
    const exists = await this.repositories.customers.existsEmail(email);
    if (exists) {
      throw new DomainEmailError(`Este e-mail já está registrado.`);
    }
  }
}
