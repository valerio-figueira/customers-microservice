import {
  CreateCustomerInput,
  CreateCustomerInterface,
  CreateCustomerOutput,
} from './create-customer.interface';
import { PasswordHasherInterface } from '../../ports/password-hasher.interface';
import { UnitOfWorkInterface } from '../../ports/unit-of-work.interface';
import { IdGeneratorInterface } from '../../ports/id-generator.interface';
import { CustomerBuilder } from '../../../domain/builders/customer.builder';
import { Password } from '../../../domain/entities/value-objects/password.vo';
import {
  MessageBrokerPublisherInterface,
  MessageBrokerPattern,
} from '../../ports/message-broker.interface';
import { DocumentPolicy } from '../../../domain/entities/policies/document-policy';
import { CustomerPolicy } from '../../../domain/entities/policies/customer-policy';

export class CreateCustomerUseCase implements CreateCustomerInterface {
  constructor(
    private readonly unitOfWork: UnitOfWorkInterface,
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly idGenerator: IdGeneratorInterface,
    private readonly messageBrokerPublisher: MessageBrokerPublisherInterface,
  ) {}

  public async create(
    input: CreateCustomerInput,
  ): Promise<CreateCustomerOutput> {
    const password = await Password.create(input.password, this.passwordHasher);
    const customer = new CustomerBuilder(this.idGenerator)
      .withId(this.idGenerator.generate('cus'))
      .withName(input.name)
      .withEmail(input.email)
      .withPassword(password)
      .withGender(input.gender)
      .withPhone(input.phone)
      .withDocuments(input.documents)
      .withDateOfBirth(input.dateOfBirth)
      .build({ validate: true });

    return this.unitOfWork.execute(async (repositories) => {
      const customerPolicy = new CustomerPolicy(repositories);
      const documentPolicy = new DocumentPolicy(repositories);
      await customerPolicy.ensureEmailIsUnique(customer.email.value);
      await documentPolicy.ensureDocumentsAreUnique(customer.documents);
      const createdCustomer = await repositories.customers.save(customer);
      await this.messageBrokerPublisher.publish({
        pattern: MessageBrokerPattern.CUSTOMER_CREATED,
        message: createdCustomer,
      });
      return createdCustomer;
    });
  }
}
