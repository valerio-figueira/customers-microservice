import {
  RepositoryFactory,
  UnitOfWorkInterface,
} from '../../../../core/app/ports/unit-of-work.interface';
import { PrismaConnection } from '../prisma.connection';
import { PrismaCustomerRepository } from './prisma-customer.repository';
import { PrismaDocumentRepository } from './prisma-document.repository';

export type PrismaTransaction = Omit<
  PrismaConnection,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$transaction'
  | '$extends'
  | 'onModuleInit'
  | 'onModuleDestroy'
>;

export class PrismaUnitOfWork implements UnitOfWorkInterface {
  constructor(private readonly prisma: PrismaConnection) {}

  public async execute<T>(
    work: (repositories: RepositoryFactory) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      // criar instâncias de repositórios com o mesmo "transaction client"
      const repositories: RepositoryFactory = {
        customers: new PrismaCustomerRepository(tx),
        documents: new PrismaDocumentRepository(tx),
      };

      return work(repositories);
    });
  }
}
