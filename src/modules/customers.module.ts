import { Module } from '@nestjs/common';
import {
  CREATE_CUSTOMER_USECASE,
  CUSTOMER_REPOSITORY,
  DYNAMO_DB_UNIT_OF_WORK,
  ID_GENERATOR,
  MESSAGE_BROKER_PUBLISHER,
  PASSWORD_HASHER,
  READ_ONE_CUSTOMER_USECASE,
} from '../infra/config/tokens';
import { CustomerRepositoryInterface } from '../core/app/ports/repositories/customers.repository.interface';
import { ReadOneCustomerUseCase } from '../core/app/usecases/read-customer/read-one-customer.usecase';
import { UnitOfWorkInterface } from '../core/app/ports/unit-of-work.interface';
import { PasswordHasherInterface } from '../core/app/ports/password-hasher.interface';
import { IdGeneratorInterface } from '../core/app/ports/id-generator.interface';
import { MessageBrokerPublisherInterface } from '../core/app/ports/message-broker.interface';
import { CreateCustomerUseCase } from '../core/app/usecases/create-customer/create-customer.usecase';
import { AwsModule } from './aws.module';
import { IdGeneratorModule } from './id-generator.module';
import { PasswordHasherModule } from './password-hasher.module';
import { RabbitMqModule } from './rabbitmq.module';

@Module({
  imports: [AwsModule, IdGeneratorModule, PasswordHasherModule, RabbitMqModule],
  providers: [
    {
      provide: READ_ONE_CUSTOMER_USECASE,
      useFactory: (customerRepository: CustomerRepositoryInterface) =>
        new ReadOneCustomerUseCase(customerRepository),
      inject: [CUSTOMER_REPOSITORY],
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
        DYNAMO_DB_UNIT_OF_WORK,
        PASSWORD_HASHER,
        ID_GENERATOR,
        MESSAGE_BROKER_PUBLISHER,
      ],
    },
  ],
  exports: [READ_ONE_CUSTOMER_USECASE, CREATE_CUSTOMER_USECASE],
})
export class CustomersModule {}
