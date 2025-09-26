import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { CustomersController } from './infra/http/customers.controller';
import { PrismaCustomerRepository } from './infra/database/prisma/repositories/prisma-customer.repository';
import { PrismaDocumentRepository } from './infra/database/prisma/repositories/prisma-document.repository';
import { PrismaUnitOfWork } from './infra/database/prisma/repositories/prisma-unit-of-work';
import { PasswordHasherInterface } from './core/app/ports/password-hasher.interface';
import { CreateCustomerUseCase } from './core/app/usecases/create-customer/create-customer.usecase';
import { UnitOfWorkInterface } from './core/app/ports/unit-of-work.interface';
import { IdGeneratorInterface } from './core/app/ports/id-generator.interface';
import { PrismaConnection } from './infra/database/prisma/prisma.connection';
import {
  CREATE_CUSTOMER_USECASE,
  CREATE_DOCUMENT_USECASE,
  CUSTOMER_REPOSITORY,
  DOCUMENT_REPOSITORY,
  ID_GENERATOR,
  MESSAGE_BROKER_PUBLISHER,
  PASSWORD_HASHER,
  READ_ONE_CUSTOMER_USECASE,
  UNIT_OF_WORK,
} from './infra/config/tokens';
import { IdGeneratorAdapter } from './infra/adapters/ids/id-generator.adapter';
import { BcryptPasswordHasherAdapter } from './infra/adapters/hashing/password-hasher.adapter';
import { MessageBrokerPublisherInterface } from './core/app/ports/message-broker.interface';
import { RabbitMQPublisherAdapter } from './infra/adapters/rabbitmq/rabbitmq-publisher.adapter';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import { RabbitMQConfig } from './infra/config/rabbitmq.config';
import { RabbitMQServices } from './infra/adapters/rabbitmq/enums/rabbitmq.enum';
import { CreateDocumentUsecase } from './core/app/usecases/create-document/create-document.usecase';
import { DocumentsController } from './infra/http/documents.controller';
import { ReadOneCustomerUseCase } from './core/app/usecases/read-customer/read-one-customer.usecase';
import { CustomerRepositoryInterface } from './core/app/ports/repositories/customers.repository.interface';

@Module({
  imports: [PrismaModule, ClientsModule.register([RabbitMQConfig])],
  controllers: [CustomersController, DocumentsController],
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
      provide: READ_ONE_CUSTOMER_USECASE,
      useFactory: (customerRepository: CustomerRepositoryInterface) =>
        new ReadOneCustomerUseCase(customerRepository),
      inject: [CUSTOMER_REPOSITORY],
    },
    {
      provide: CREATE_DOCUMENT_USECASE,
      useFactory: (
        unitOfWork: UnitOfWorkInterface,
        idGenerator: IdGeneratorInterface,
      ) => new CreateDocumentUsecase(unitOfWork, idGenerator),
      inject: [UNIT_OF_WORK, ID_GENERATOR],
    },
    {
      provide: UNIT_OF_WORK,
      useFactory: (prisma: PrismaConnection) => new PrismaUnitOfWork(prisma),
      inject: [PrismaConnection],
    },
    { provide: ID_GENERATOR, useFactory: () => new IdGeneratorAdapter() },
    {
      provide: PASSWORD_HASHER,
      useFactory: () => new BcryptPasswordHasherAdapter(),
    },
    {
      provide: MESSAGE_BROKER_PUBLISHER,
      useFactory: (clientProxy: ClientProxy) =>
        new RabbitMQPublisherAdapter(clientProxy),
      inject: [RabbitMQServices.CUSTOMERS_RMQ],
    },
    {
      provide: CREATE_CUSTOMER_USECASE,
      useFactory: (
        unitOfWork: UnitOfWorkInterface,
        passwordHasher: PasswordHasherInterface,
        idGenerator: IdGeneratorInterface,
        messageBrokerPublisher: MessageBrokerPublisherInterface,
      ) =>
        new CreateCustomerUseCase(
          unitOfWork,
          passwordHasher,
          idGenerator,
          messageBrokerPublisher,
        ),
      inject: [
        UNIT_OF_WORK,
        PASSWORD_HASHER,
        ID_GENERATOR,
        MESSAGE_BROKER_PUBLISHER,
      ],
    },
  ],
  exports: [MESSAGE_BROKER_PUBLISHER],
})
export class AppModule {}
