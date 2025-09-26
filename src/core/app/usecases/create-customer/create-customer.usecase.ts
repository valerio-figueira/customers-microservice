import {
  CreateCustomerInput,
  CreateCustomerInterface,
  CreateCustomerOutput,
} from './create-customer.interface';
import { PasswordHasherInterface } from '../../ports/password-hasher.interface';
import {
  RepositoryFactory,
  UnitOfWorkInterface,
} from '../../ports/unit-of-work.interface';
import { IdGeneratorInterface } from '../../ports/id-generator.interface';
import { Document } from '../../../domain/entities/document.entity';
import { CustomerBuilder } from '../../../domain/builders/customer.builder';
import { Password } from '../../../domain/entities/password.entity';
import { ApplicationValidationError } from '../../exceptions/application-validation.error';
import {
  MessageBrokerPublisherInterface,
  MessageBrokerPattern,
} from '../../ports/message-broker.interface';

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
      await this.ensureEmailIsUnique(customer.email.value, repositories);
      await this.ensureDocumentsAreUnique(customer.documents, repositories);
      const createdCustomer = await repositories.customers.save(customer);
      await this.messageBrokerPublisher.publish({
        pattern: MessageBrokerPattern.CUSTOMER_CREATED,
        message: createdCustomer,
      });
      return createdCustomer;
    });
  }

  private async ensureEmailIsUnique(
    email: string,
    repositories: RepositoryFactory,
  ): Promise<void> {
    const emailExists = await repositories.customers.existsEmail(email);
    if (emailExists) {
      throw new ApplicationValidationError(`Este e-mail já está registrado.`);
    }
  }

  private async ensureDocumentsAreUnique(
    documents: Document[],
    repositories: RepositoryFactory,
  ): Promise<void> {
    for (const doc of documents) {
      const exists = await repositories.documents.exists(doc.value);
      if (!exists) continue;
      throw new ApplicationValidationError('Este documento já existe.');
    }
  }
}
