import {
  CreateDocumentInput,
  CreateDocumentUseCaseInterface,
  CreateDocumentOutput,
} from './create-document.interface';
import {
  RepositoryFactoryInterface,
  UnitOfWorkInterface,
} from '../../ports/unit-of-work.interface';
import { Document } from '../../../domain/entities/document.entity';
import { IdGeneratorInterface } from '../../ports/id-generator.interface';
import { DocumentPolicy } from '../../../domain/entities/document-policy';

export class CreateDocumentUseCase implements CreateDocumentUseCaseInterface {
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

    return this.unitOfWork.execute(
      async (repositories: RepositoryFactoryInterface) => {
        const policy = new DocumentPolicy(repositories);
        await policy.ensureCustomerExists(document.customerId);
        await policy.ensureDocumentIsUnique(document);
        await policy.ensureDocumentTypeIsUnique(document);
        return repositories.documents.save(document);
      },
    );
  }
}
