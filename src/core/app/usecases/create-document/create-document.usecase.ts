import {
  CreateDocumentInput,
  CreateDocumentInterface,
  CreateDocumentOutput,
} from './create-document.interface';
import {
  RepositoryFactory,
  UnitOfWorkInterface,
} from '../../ports/unit-of-work.interface';
import { ApplicationValidationError } from '../../exceptions/application-validation.error';
import { Document } from '../../../domain/entities/document.entity';
import { IdGeneratorInterface } from '../../ports/id-generator.interface';

export class CreateDocumentUsecase implements CreateDocumentInterface {
  constructor(
    private readonly unitOfWork: UnitOfWorkInterface,
    private readonly idGenerator: IdGeneratorInterface,
  ) {}

  public async create(
    input: CreateDocumentInput,
  ): Promise<CreateDocumentOutput> {
    const document = new Document({
      id: this.idGenerator.generate('doc'),
      customerId: input.customerId,
      type: input.type,
      value: input.value,
      issueDate: input.issueDate,
      issuingAuthority: input.issuingAuthority,
      expirationDate: input.expirationDate,
    });

    return this.unitOfWork.execute(async (repositories: RepositoryFactory) => {
      await this.ensureCustomerExists(document.customerId, repositories);
      await this.ensureDocumentIsUnique(document, repositories);
      await this.ensureDocumentTypeIsUnique(document, repositories);
      const { id } = await repositories.documents.save(document);
      return repositories.documents.findByIdOrThrow(id);
    });
  }

  private async ensureDocumentIsUnique(
    document: Document,
    repositories: RepositoryFactory,
  ): Promise<void> {
    const existing = await repositories.documents.findDocument(document.value);
    if (!existing) return;
    if (existing.customerId === document.customerId) {
      throw new ApplicationValidationError(
        'O usuário já possui este documento cadastrado.',
      );
    }
    throw new ApplicationValidationError('Este documento já está cadastrado.');
  }

  private async ensureCustomerExists(
    customerId: string,
    repositories: RepositoryFactory,
  ): Promise<void> {
    const customer = await repositories.customers.findById(customerId);
    if (!customer) {
      throw new ApplicationValidationError('Usuário não encontrado.');
    }
  }

  private async ensureDocumentTypeIsUnique(
    document: Document,
    repositories: RepositoryFactory,
  ): Promise<void> {
    const existing = await repositories.documents.findByCustomerAndType(
      document.customerId,
      document.type,
    );

    if (existing) {
      throw new ApplicationValidationError(
        `O usuário já possui um documento do tipo ${document.type}.`,
      );
    }
  }
}
