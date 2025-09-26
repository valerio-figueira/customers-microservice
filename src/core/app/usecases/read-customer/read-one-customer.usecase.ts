import {
  ReadOneCustomerOutput,
  ReadOneCustomerUseCaseInterface,
} from './read-customer.interface';
import { CustomerRepositoryInterface } from '../../ports/repositories/customers.repository.interface';
import { ApplicationNotFoundError } from '../../exceptions/application-not-found.error';

export class ReadOneCustomerUseCase implements ReadOneCustomerUseCaseInterface {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  public async readOne(customerId: string): Promise<ReadOneCustomerOutput> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new ApplicationNotFoundError('Usuário não encontrado.');
    }
    return customer;
  }
}
