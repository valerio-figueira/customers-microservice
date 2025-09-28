import { Module } from '@nestjs/common';
import {
  DYNAMO_DB_ADAPTER,
  DYNAMO_DB_CUSTOMERS_REPOSITORY,
  DYNAMO_DB_DOCUMENTS_REPOSITORY,
  DYNAMO_DB_UNIT_OF_WORK,
} from '../infra/config/tokens';
import { DynamoDbAdapter } from '../infra/adapters/aws/dynamodb/dynamo-db.adapter';
import { DynamodbCustomersRepository } from '../infra/adapters/aws/dynamodb/repositories/dynamodb-customers.repository';
import { DynamoDbDocumentsRepository } from '../infra/adapters/aws/dynamodb/repositories/dynamodb-documents.repository';
import { DynamoDbUnitOfWork } from '../infra/adapters/aws/dynamodb/dynamodb-unit-of-work';

@Module({
  providers: [
    {
      provide: DYNAMO_DB_ADAPTER,
      useFactory: () => new DynamoDbAdapter(),
      inject: [],
    },
    {
      provide: DYNAMO_DB_CUSTOMERS_REPOSITORY,
      useFactory: (awsDynamoDbAdapter: DynamoDbAdapter) =>
        new DynamodbCustomersRepository(awsDynamoDbAdapter),
      inject: [DYNAMO_DB_ADAPTER],
    },
    {
      provide: DYNAMO_DB_DOCUMENTS_REPOSITORY,
      useFactory: (awsDynamoDbAdapter: DynamoDbAdapter) =>
        new DynamoDbDocumentsRepository(awsDynamoDbAdapter),
      inject: [DYNAMO_DB_ADAPTER],
    },
    {
      provide: DYNAMO_DB_UNIT_OF_WORK,
      useFactory: (dynamoDbAdapter: DynamoDbAdapter) =>
        new DynamoDbUnitOfWork(dynamoDbAdapter),
      inject: [DYNAMO_DB_ADAPTER],
    },
  ],
  exports: [
    DYNAMO_DB_CUSTOMERS_REPOSITORY,
    DYNAMO_DB_DOCUMENTS_REPOSITORY,
    DYNAMO_DB_UNIT_OF_WORK,
  ],
})
export class DynamoDbModule {}
