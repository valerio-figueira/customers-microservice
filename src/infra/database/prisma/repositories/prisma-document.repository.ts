import { PrismaConnection } from '../prisma.connection';
import { PrismaTransaction } from './prisma-unit-of-work';
import { DocumentRepositoryInterface } from '../../../../core/app/ports/repositories/document.repository.interface';
import { DocumentInterface } from '../../../../core/domain/entities/interfaces/document.interface';
import { DocumentMapper } from '../../../mappers/document.mapper';

export class PrismaDocumentRepository implements DocumentRepositoryInterface {
  constructor(private readonly prisma: PrismaConnection | PrismaTransaction) {}

  public async save(document: DocumentInterface): Promise<{ id: string }> {
    return this.prisma.document.create({
      data: DocumentMapper.toPersistence(document),
      select: { id: true },
    });
  }

  public async exists(value: string): Promise<boolean> {
    const exists = await this.prisma.document.findFirst({
      where: { value },
      select: { id: true },
    });
    return !!exists;
  }
}
