import { Global, Module } from '@nestjs/common';
import { PrismaConnection } from '../infra/database/prisma/prisma.connection';
import {
  CUSTOMER_REPOSITORY,
  DOCUMENT_REPOSITORY,
  PRISMA_UNIT_OF_WORK,
} from '../infra/config/tokens';
import { PrismaUnitOfWork } from '../infra/database/prisma/repositories/prisma-unit-of-work';
import { PrismaDocumentRepository } from '../infra/database/prisma/repositories/prisma-document.repository';
import { PrismaCustomerRepository } from '../infra/database/prisma/repositories/prisma-customer.repository';

@Global()
@Module({
  providers: [
    PrismaConnection,
    {
      provide: PRISMA_UNIT_OF_WORK,
      useFactory: (prisma: PrismaConnection) => new PrismaUnitOfWork(prisma),
      inject: [PrismaConnection],
    },
    {
      provide: DOCUMENT_REPOSITORY,
      useFactory: (prisma: PrismaConnection) =>
        new PrismaDocumentRepository(prisma),
      inject: [PrismaConnection],
    },
    {
      provide: CUSTOMER_REPOSITORY,
      useFactory: (prisma: PrismaConnection) =>
        new PrismaCustomerRepository(prisma),
      inject: [PrismaConnection],
    },
  ],
  exports: [
    PrismaConnection,
    PRISMA_UNIT_OF_WORK,
    DOCUMENT_REPOSITORY,
    CUSTOMER_REPOSITORY,
  ],
})
export class PrismaModule {}
