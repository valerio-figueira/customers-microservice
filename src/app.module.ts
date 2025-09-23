import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/orms/prisma/prisma.module';
import { CustomersController } from './infra/http/customers.controller';
import { PrismaCustomerRepository } from './infra/orms/prisma/repositories/prisma-customer.repository';
import { PrismaDocumentRepository } from './infra/orms/prisma/repositories/prisma-document.repository';
import { PrismaUnitOfWork } from './infra/orms/prisma/repositories/prisma-unit-of-work';
import { PasswordHasherInterface } from './core/app/ports/password-hasher.interface';
import { CreateCustomerUseCase } from './core/app/usecases/create-customer/create-customer.usecase';
import { UnitOfWorkInterface } from './core/app/ports/unit-of-work.interface';
import { IdGeneratorInterface } from './core/app/ports/id-generator.interface';
import { PrismaConnection } from './infra/orms/prisma/prisma.connection';
import {
  CREATE_CUSTOMER_USECASE,
  CUSTOMER_REPOSITORY,
  DOCUMENT_REPOSITORY,
  ID_GENERATOR,
  PASSWORD_HASHER,
  UNIT_OF_WORK,
} from './infra/tokens';
import { IdGenerator } from './infra/utils/id-generator.util';
import { BcryptPasswordHasher } from './infra/utils/password-hasher.util';

@Module({
  imports: [PrismaModule],
  controllers: [CustomersController],
  providers: [
    PrismaConnection,
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
    {
      provide: UNIT_OF_WORK,
      useFactory: (prisma: PrismaConnection) => new PrismaUnitOfWork(prisma),
      inject: [PrismaConnection],
    },
    { provide: ID_GENERATOR, useFactory: () => new IdGenerator() },
    {
      provide: PASSWORD_HASHER,
      useFactory: () => new BcryptPasswordHasher(),
    },
    {
      provide: CREATE_CUSTOMER_USECASE,
      useFactory: (
        unitOfWork: UnitOfWorkInterface,
        passwordHasher: PasswordHasherInterface,
        idGenerator: IdGeneratorInterface,
      ) => new CreateCustomerUseCase(unitOfWork, passwordHasher, idGenerator),
      inject: [UNIT_OF_WORK, PASSWORD_HASHER, ID_GENERATOR],
    },
  ],
})
export class AppModule {}
