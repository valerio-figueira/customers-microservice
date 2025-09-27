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
import { DocumentMapper } from '../../../../mappers/document.mapper';
import { RepositoryInternalError } from '../../../../../core/app/exceptions/repository-internal.error';
import { PersistedDocumentInterface } from '../../../../../core/domain/entities/interfaces/document.interface';
import { DynamoDbAdapter } from '../dynamo-db.adapter';
import { DynamoKeys } from '../keys/dynamo.keys';

export class DynamodbCustomersRepository
  implements CustomerRepositoryInterface
{
  private readonly tableName = 'CustomersTable';

  constructor(private readonly dynamoDb: DynamoDbAdapter) {}

  public async save(
    customer: CustomerInterface,
  ): Promise<Omit<PersistedCustomerInterface, 'password'>> {
    const customerPersistence = CustomerMapper.toPersistence(customer);

    // Cria transação (Customer + E-mail Policy + Documents)
    await this.dynamoDb.transactWriteItem(<TransactWriteItem[]>[
      {
        Put: {
          TableName: this.tableName,
          Item: marshall({
            PK: DynamoKeys.customerPK(customer.id),
            SK: DynamoKeys.customerSK(customer.id),
            itemType: 'Customer',
            ...customerPersistence,
            dateOfBirth: customerPersistence.dateOfBirth.toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: null,
            deletedAt: null,
          }),
          ConditionExpression:
            'attribute_not_exists(PK) AND attribute_not_exists(SK)', // evita sobrescrever
        },
      },
      {
        Put: {
          TableName: this.tableName,
          Item: marshall({
            PK: DynamoKeys.customerEmailPK(customer.email.value),
            SK: DynamoKeys.customerEmailSK(),
            itemType: 'CustomerEmailLookup',
          }),
          ConditionExpression:
            'attribute_not_exists(PK) AND attribute_not_exists(SK)',
        },
      },
      ...customer.documents.flatMap((doc) => {
        return [
          {
            Put: {
              TableName: this.tableName,
              Item: marshall({
                PK: DynamoKeys.documentPK(customer.id),
                SK: DynamoKeys.documentSK(doc.id),
                itemType: 'Document',
                ...DocumentMapper.toPersistence(doc),
                createdAt: new Date().toISOString(),
                updatedAt: null,
                deletedAt: null,
              }),
              ConditionExpression:
                'attribute_not_exists(PK) AND attribute_not_exists(SK)',
            },
          },
          {
            Put: {
              TableName: this.tableName,
              Item: marshall({
                PK: DynamoKeys.documentValuePK(doc.value),
                SK: DynamoKeys.documentValueSK(),
                itemType: `DocumentValueLookup`,
                id: doc.id,
                customerId: customer.id,
                type: doc.type,
                value: doc.value,
              }),
              ConditionExpression:
                'attribute_not_exists(PK) AND attribute_not_exists(SK)',
            },
          },
          {
            Put: {
              TableName: this.tableName,
              Item: marshall({
                PK: DynamoKeys.customerDocumentTypePK(doc.customerId, doc.type),
                SK: DynamoKeys.customerDocumentTypeSK(),
                itemType: 'CustomerDocumentTypeLookup',
                id: doc.id,
                customerId: customer.id,
                type: doc.type,
                value: doc.value,
              }),
              ConditionExpression:
                'attribute_not_exists(PK) AND attribute_not_exists(SK)',
            },
          },
          {
            Put: {
              TableName: this.tableName,
              Item: marshall({
                PK: DynamoKeys.customerDocumentIdPK(doc.id),
                SK: DynamoKeys.customerDocumentIdSK(),
                itemType: 'CustomerDocumentIdLookup',
                id: doc.id,
                customerId: customer.id,
                type: doc.type,
                value: doc.value,
              }),
              ConditionExpression:
                'attribute_not_exists(PK) AND attribute_not_exists(SK)',
            },
          },
        ];
      }),
    ]);

    const persisted = await this.findById(customer.id);

    if (!persisted) {
      throw new RepositoryInternalError(
        `Erro de persistência - Usuário não encontrado: ${customer.id}`,
      );
    }

    return persisted;
  }

  public async findById(
    id: string,
  ): Promise<Omit<PersistedCustomerInterface, 'password'> | null> {
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
    const metadata = items.find((i) => i.itemType === 'Customer');
    const documents = items.filter((i) => i.itemType === 'Document');

    if (!metadata) return null;

    return CustomerMapper.fromDynamo(
      <PersistedCustomerInterface>metadata,
      <PersistedDocumentInterface[]>documents,
    );
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
  ): Promise<Omit<PersistedCustomerInterface, 'password'>> {
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
