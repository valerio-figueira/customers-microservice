import { PrismaConnection } from '../prisma.connection';
import { PrismaTransaction } from './prisma-unit-of-work';
import {
  DocumentRepositoryInterface,
  FindOneDocumentOptions,
} from '../../../../core/app/ports/repositories/document.repository.interface';
import {
  DocumentInterface,
  DocumentTypes,
  PersistedDocumentInterface,
} from '../../../../core/domain/entities/interfaces/document.interface';
import { DocumentMapper } from '../../../mappers/document.mapper';

export class PrismaDocumentRepository implements DocumentRepositoryInterface {
  constructor(private readonly prisma: PrismaConnection | PrismaTransaction) {}

  public async save(
    document: DocumentInterface,
  ): Promise<PersistedDocumentInterface> {
    return this.prisma.document.create({
      data: DocumentMapper.toPersistence(document),
      select: {
        id: true,
        customerId: true,
        type: true,
        value: true,
        expirationDate: true,
        issuingAuthority: true,
        issueDate: true,
        updatedAt: true,
        createdAt: true,
        deletedAt: true,
      },
    });
  }

  public async exists(value: string): Promise<boolean> {
    const exists = await this.prisma.document.findFirst({
      where: { value },
      select: { id: true },
    });
    return !!exists;
  }

  public async findDocument(
    value: string,
  ): Promise<PersistedDocumentInterface | null> {
    return this.prisma.document.findFirst({
      where: { value },
      select: {
        id: true,
        customerId: true,
        type: true,
        value: true,
        expirationDate: true,
        issuingAuthority: true,
        issueDate: true,
        updatedAt: true,
        createdAt: true,
        deletedAt: true,
      },
    });
  }

  public async findOneOrThrow(
    where: FindOneDocumentOptions,
  ): Promise<PersistedDocumentInterface> {
    return this.prisma.document.findUniqueOrThrow({
      where,
      select: {
        id: true,
        customerId: true,
        type: true,
        value: true,
        expirationDate: true,
        issuingAuthority: true,
        issueDate: true,
        updatedAt: true,
        createdAt: true,
        deletedAt: true,
      },
    });
  }

  public async findByCustomerAndType(
    customerId: string,
    type: DocumentTypes,
  ): Promise<boolean> {
    const exists = await this.prisma.document.findFirst({
      where: { customerId, type },
    });
    return !!exists;
  }
}
