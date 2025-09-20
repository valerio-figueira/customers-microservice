import {
  CreateCustomerInput,
  CreateCustomerOutput,
  CreateCustomerUseCaseInterface,
} from './interfaces/create-customer.usecase.interface';
import { PasswordHasherInterface } from '../../ports/password-hasher.interface';
import { UnitOfWorkInterface } from '../../ports/unit-of-work.interface';
import { IdGeneratorInterface } from '../../ports/id-generator.interface';
import { DocumentRepositoryInterface } from '../../../domain/repositories/document.repository.interface';
import { Document } from '../../../domain/entities/document.entity';
import { CustomerBuilder } from '../../../domain/builders/customer.builder';
import { ApplicationValidationError } from '../../commons/errors/errors';

export class CreateCustomerUseCase implements CreateCustomerUseCaseInterface {
  constructor(
    private readonly unitOfWork: UnitOfWorkInterface,
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly IdGenerator: IdGeneratorInterface,
  ) {}

  public async create(
    input: CreateCustomerInput,
  ): Promise<CreateCustomerOutput> {
    const customer = new CustomerBuilder()
      .withId(this.IdGenerator.generate('cus'))
      .withName(input.name)
      .withEmail(input.email)
      .withPassword(await this.passwordHasher.hash(input.password, 10))
      .withGender(input.gender)
      .withPhone(input.phone)
      .withDocuments(input.documents, this.IdGenerator)
      .withDateOfBirth(input.dateOfBirth)
      .build({ validate: true });

    return this.unitOfWork.execute(async (repositories) => {
      const emailExists = await repositories.customers.existsEmail(
        customer.email.value,
      );

      if (emailExists) {
        throw new ApplicationValidationError(`Este e-mail já está registrado.`);
      }

      await this.throwIfDocumentExists(
        customer.documents,
        repositories.documents,
      );
      return repositories.customers.save(customer);
    });
  }

  private async throwIfDocumentExists(
    documents: Document[],
    documentRepository: DocumentRepositoryInterface,
  ): Promise<void> {
    for (const doc of documents) {
      const exists = await documentRepository.exists(doc.value);
      if (!exists) continue;
      throw new ApplicationValidationError('Este documento já existe.');
    }
  }
}
