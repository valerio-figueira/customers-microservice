import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  DocumentRepositoryInterface,
  FindOneDocumentOptions,
} from '../../../../../core/app/ports/repositories/document.repository.interface';
import {
  DocumentInterface,
  DocumentTypes,
  PersistedDocumentInterface,
} from '../../../../../core/domain/entities/interfaces/document.interface';
import { DocumentMapper } from '../../../../mappers/document.mapper';
import { DynamoDbAdapter } from '../dynamo-db.adapter';
import { DynamoKeys } from '../keys/dynamo.keys';
import { RepositoryInternalError } from '../../../../../core/app/exceptions/repository-internal.error';

export class DynamoDbDocumentsRepository
  implements DocumentRepositoryInterface
{
  private readonly tableName = 'CustomersTable';

  constructor(private readonly dynamoDb: DynamoDbAdapter) {}

  public async save(
    document: DocumentInterface,
  ): Promise<PersistedDocumentInterface> {
    const { id, customerId, type, value } = document;

    await this.dynamoDb.transactWriteItem([
      {
        Put: {
          TableName: this.tableName,
          Item: marshall({
            PK: DynamoKeys.documentPK(customerId),
            SK: DynamoKeys.documentSK(id),
            itemType: 'Document',
            ...DocumentMapper.toPersistence(document),
          }),
          ConditionExpression:
            'attribute_not_exists(PK) AND attribute_not_exists(SK)', // evita sobrescrever
        },
      },
      {
        Put: {
          TableName: this.tableName,
          Item: marshall({
            PK: DynamoKeys.documentValuePK(value),
            SK: DynamoKeys.documentValueSK(),
            itemType: `DocumentValueLookup`,
            id,
            customerId,
            type,
            value,
          }),
          ConditionExpression:
            'attribute_not_exists(PK) AND attribute_not_exists(SK)',
        },
      },
      {
        Put: {
          TableName: this.tableName,
          Item: marshall({
            PK: DynamoKeys.customerDocumentTypePK(customerId, type),
            SK: DynamoKeys.customerDocumentTypeSK(),
            itemType: 'CustomerDocumentTypeLookup',
            id,
            customerId,
            type,
            value,
          }),
          ConditionExpression:
            'attribute_not_exists(PK) AND attribute_not_exists(SK)',
        },
      },
      {
        Put: {
          TableName: this.tableName,
          Item: marshall({
            PK: DynamoKeys.customerDocumentIdPK(id),
            SK: DynamoKeys.customerDocumentIdSK(),
            itemType: 'CustomerDocumentIdLookup',
            id,
            customerId,
            type,
            value,
          }),
          ConditionExpression:
            'attribute_not_exists(PK) AND attribute_not_exists(SK)',
        },
      },
    ]);

    return this.findOneOrThrow({ id, customerId });
  }

  public async exists(value: string): Promise<boolean> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({
        PK: DynamoKeys.documentValuePK(value),
        SK: DynamoKeys.documentValueSK(),
      }),
    });
    const output = await this.dynamoDb.getItem(command);
    return !!output;
  }

  public async findDocument(
    value: string,
  ): Promise<PersistedDocumentInterface | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({
        PK: DynamoKeys.documentValuePK(value),
        SK: DynamoKeys.documentValueSK(),
      }),
      AttributesToGet: ['id', 'customerId'],
    });

    const lookup = await this.dynamoDb.getItem(command);
    if (!lookup) return null;
    const item = <{ id: string; customerId: string }>unmarshall(lookup);
    return this.findMainRecord(item.id, item.customerId);
  }

  public async findMainRecord(
    documentId: string,
    customerId: string,
  ): Promise<PersistedDocumentInterface | null> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({
        PK: DynamoKeys.documentPK(customerId),
        SK: DynamoKeys.documentSK(documentId),
      }),
    });
    const output = await this.dynamoDb.getItem(command);
    if (!output) return null;
    return <PersistedDocumentInterface>unmarshall(output);
  }

  public async findOneOrThrow(
    options: FindOneDocumentOptions,
  ): Promise<PersistedDocumentInterface> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({
        PK: DynamoKeys.customerDocumentIdPK(options.id),
        SK: DynamoKeys.customerDocumentIdSK(),
      }),
      AttributesToGet: ['id', 'value'],
    });

    const lookup = await this.dynamoDb.getItem(command);
    if (!lookup) {
      throw new RepositoryInternalError(`Documento não encontrado.`);
    }

    const output = await this.findDocument(<string>unmarshall(lookup).value);
    if (!output) {
      throw new RepositoryInternalError(`Documento não encontrado.`);
    }
    return output;
  }

  public async findByCustomerAndType(
    customerId: string,
    type: DocumentTypes,
  ): Promise<boolean> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({
        PK: DynamoKeys.customerDocumentTypePK(customerId, type),
        SK: DynamoKeys.customerDocumentTypeSK(),
      }),
    });
    const output = await this.dynamoDb.getItem(command);
    return !!output;
  }
}
