import {
  GetItemCommand,
  QueryCommand,
  TransactWriteItem,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { CustomerRepositoryInterface } from '../../../../../core/app/ports/repositories/customers.repository.interface';
import {
  CustomerInterface,
  PersistedCustomerInterface,
} from '../../../../../core/domain/entities/interfaces/customer.interface';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { CustomerMapper } from '../../../../mappers/customer.mapper';
import { RepositoryInternalError } from '../../../../../core/app/exceptions/repository-internal.error';
import { PersistedDocumentInterface } from '../../../../../core/domain/entities/interfaces/document.interface';
import { DynamoDbAdapter } from '../dynamo-db.adapter';
import { DynamoKeys } from '../keys/dynamo.keys';
import { DynamoPutFactory } from '../factories/dynamo-put.factory';

export class DynamodbCustomersRepository
  implements CustomerRepositoryInterface
{
  private readonly tableName = 'CustomersTable';

  constructor(private readonly dynamoDb: DynamoDbAdapter) {}

  public async save(customer: CustomerInterface): Promise<CustomerInterface> {
    const persistence = CustomerMapper.toPersistence(customer);

    // Cria transação (Customer + E-mail Policy + Documents)
    await this.dynamoDb.transactWriteItem(<TransactWriteItem[]>[
      DynamoPutFactory.buildCustomer(this.tableName, persistence),
      DynamoPutFactory.buildCustomerEmailLookup(this.tableName, persistence),
      ...customer.documents.flatMap((doc) => {
        return [
          DynamoPutFactory.buildDocument(this.tableName, doc),
          DynamoPutFactory.buildDocumentValueLookup(this.tableName, doc),
          DynamoPutFactory.buildCustomerDocumentTypeLookup(this.tableName, doc),
          DynamoPutFactory.buildCustomerDocumentIdLookup(this.tableName, doc),
        ];
      }),
    ]);

    const domain = await this.findById(customer.id);

    if (!domain) {
      throw new RepositoryInternalError(
        `Erro de persistência - Usuário não encontrado: ${customer.id}`,
      );
    }

    return domain;
  }

  public async findById(id: string): Promise<CustomerInterface | null> {
    // Query todos os itens do cliente (metadata + documents)
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: DynamoKeys.customerPK(id) },
      },
    });

    const output = await this.dynamoDb.queryItems(command);
    if (!output || output?.length === 0) return null;

    const items = output.map((i) => unmarshall(i));
    const metadata = <PersistedCustomerInterface>(
      items.find((i) => i.itemType === 'Customer')
    );
    const documents = <PersistedDocumentInterface[]>(
      items.filter((i) => i.itemType === 'Document')
    );

    if (!metadata) return null;
    Object.assign(metadata, { documents });
    return CustomerMapper.toDomain(metadata);
  }

  public async existsEmail(email: string): Promise<boolean> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({
        PK: DynamoKeys.customerEmailPK(email),
        SK: DynamoKeys.customerEmailSK(),
      }),
    });
    const output = await this.dynamoDb.getItem(command);
    return !!output;
  }

  public async exists(id: string): Promise<boolean> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({
        PK: DynamoKeys.customerPK(id),
        SK: DynamoKeys.customerSK(id),
      }),
      ProjectionExpression: 'PK', // só traz a chave, economizando leitura
    });

    const output = await this.dynamoDb.getItem(command);
    return !!output;
  }

  public async updateAvatarPath(
    id: string,
    avatarPath: string,
  ): Promise<CustomerInterface> {
    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: marshall({
        PK: DynamoKeys.customerPK(id),
        SK: DynamoKeys.customerSK(id),
      }),
      UpdateExpression: 'SET avatarPath = :avatarPath, updatedAt = :updatedAt',
      ExpressionAttributeValues: marshall({
        ':avatarPath': avatarPath,
        ':updatedAt': new Date().toISOString(),
      }),
      ReturnValues: 'NONE',
    });

    await this.dynamoDb.updateItem(command);
    const customer = await this.findById(id);

    if (!customer) {
      throw new RepositoryInternalError(
        `[DynamoCustomerRepository] Customer não encontrado: ${id}`,
      );
    }
    return customer;
  }
}
