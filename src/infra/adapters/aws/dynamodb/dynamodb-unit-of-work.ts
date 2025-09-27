import {
  RepositoryFactoryInterface,
  UnitOfWorkInterface,
} from '../../../../core/app/ports/unit-of-work.interface';
import { DynamoDbAdapter } from './dynamo-db.adapter';
import { DynamodbCustomersRepository } from './repositories/dynamodb-customers.repository';
import { DynamoDbDocumentsRepository } from './repositories/dynamodb-documents.repository';

export class DynamoDbUnitOfWork implements UnitOfWorkInterface {
  constructor(private readonly awsDynamoDbAdapter: DynamoDbAdapter) {}

  public async execute<T>(
    work: (repositories: RepositoryFactoryInterface) => Promise<T>,
  ): Promise<T> {
    /*
     * TO-DO: Adicionar TransactWriteItem para transações de escrita atômicas.
     */

    const repositories: RepositoryFactoryInterface = {
      customers: new DynamodbCustomersRepository(this.awsDynamoDbAdapter),
      documents: new DynamoDbDocumentsRepository(this.awsDynamoDbAdapter),
    };

    // disparar usando TransactWriteItems
    return work(repositories);
  }
}
