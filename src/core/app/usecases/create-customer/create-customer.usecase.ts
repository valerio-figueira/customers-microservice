import {
  CreateCustomerInput,
  CreateCustomerOutput,
  CreateCustomerInterface,
} from './create-customer.interface';
import { PasswordHasherInterface } from '../../ports/password-hasher.interface';
import {
  RepositoryFactory,
  UnitOfWorkInterface,
} from '../../ports/unit-of-work.interface';
import { IdGeneratorInterface } from '../../ports/id-generator.interface';
import { Document } from '../../../domain/entities/document.entity';
import { CustomerBuilder } from '../../../domain/builders/customer.builder';
import { ApplicationValidationError } from '../../commons/errors/errors';
import { Password } from '../../../domain/entities/password.entity';

export class CreateCustomerUseCase implements CreateCustomerInterface {
  constructor(
    private readonly unitOfWork: UnitOfWorkInterface,
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly idGenerator: IdGeneratorInterface,
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
      await this.throwIfEmailExists(customer.email.value, repositories);
      await this.throwIfDocumentExists(customer.documents, repositories);
      return repositories.customers.save(customer);
    });
  }

  private async throwIfEmailExists(
    email: string,
    repositories: RepositoryFactory,
  ): Promise<void> {
    const emailExists = await repositories.customers.existsEmail(email);
    if (emailExists) {
      throw new ApplicationValidationError(`Este e-mail já está registrado.`);
    }
  }

  private async throwIfDocumentExists(
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
