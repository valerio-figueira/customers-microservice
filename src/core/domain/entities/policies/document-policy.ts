import { DomainDocumentError } from '../../exceptions/domain-document.error';
import { RepositoryFactoryInterface } from '../../../app/ports/unit-of-work.interface';
import { DocumentInterface } from '../interfaces/document.interface';
import { DocumentPolicyInterface } from './interfaces/document-policy.interface';
import { Document } from '../document.entity';

export class DocumentPolicy implements DocumentPolicyInterface {
  constructor(private readonly repositories: RepositoryFactoryInterface) {}

  public async ensureCustomerExists(customerId: string): Promise<void> {
    const customer = await this.repositories.customers.findById(customerId);
    if (!customer) {
      throw new DomainDocumentError('Usuário não encontrado.');
    }
  }

  public async ensureDocumentIsUnique(
    document: DocumentInterface,
  ): Promise<void> {
    const existing = await this.repositories.documents.findDocument(
      document.value,
    );
    if (!existing) return;

    if (existing.customerId === document.customerId) {
      throw new DomainDocumentError(
        'O usuário já possui este documento cadastrado.',
      );
    }

    throw new DomainDocumentError('Este documento já está cadastrado.');
  }

  public async ensureDocumentsAreUnique(documents: Document[]): Promise<void> {
    for (const doc of documents) {
      await this.ensureDocumentIsUnique(doc);
    }
  }

  public async ensureDocumentTypeIsUnique(
    document: DocumentInterface,
  ): Promise<void> {
    const existing = await this.repositories.documents.findByCustomerAndType(
      document.customerId,
      document.type,
    );

    if (existing) {
      throw new DomainDocumentError(
        `O usuário já possui um documento do tipo ${document.type}.`,
      );
    }
  }
}
