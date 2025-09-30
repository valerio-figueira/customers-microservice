import { PersistedCustomerInterface } from '../../../../../core/domain/entities/interfaces/customer.interface';
import { marshall } from '@aws-sdk/util-dynamodb';
import {
  CustomerEmailLookup,
  CustomerSchema,
} from '../schemas/customer.schema';
import { DynamoKeys } from '../keys/dynamo.keys';
import { DynamoItemType } from '../enums/dynamo-item-type.enum';
import { DocumentInterface } from '../../../../../core/domain/entities/interfaces/document.interface';
import {
  CustomerDocumentIdLookup,
  CustomerDocumentTypeLookup,
  DocumentSchema,
  DocumentValueLookup,
} from '../schemas/document.schema';
import { DocumentMapper } from '../../../../mappers/document.mapper';

export class DynamoPutFactory {
  public static buildCustomer(
    tableName: string,
    persistence: Omit<
      PersistedCustomerInterface,
      'documents' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ) {
    return {
      Put: {
        TableName: tableName,
        Item: marshall(
          CustomerSchema.parse({
            PK: DynamoKeys.customerPK(persistence.id),
            SK: DynamoKeys.customerSK(persistence.id),
            itemType: DynamoItemType.Customer,
            ...persistence,
            dateOfBirth: persistence.dateOfBirth.toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: null,
            deletedAt: null,
          }),
        ),
        ConditionExpression:
          'attribute_not_exists(PK) AND attribute_not_exists(SK)',
      },
    };
  }

  public static buildCustomerEmailLookup(
    tableName: string,
    persistence: Omit<
      PersistedCustomerInterface,
      'documents' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ) {
    return {
      Put: {
        TableName: tableName,
        Item: marshall(
          CustomerEmailLookup.parse({
            PK: DynamoKeys.customerEmailPK(persistence.email),
            SK: DynamoKeys.customerEmailSK(),
            itemType: DynamoItemType.CustomerEmailLookup,
            id: persistence.id,
            email: persistence.email,
          }),
        ),
        ConditionExpression:
          'attribute_not_exists(PK) AND attribute_not_exists(SK)',
      },
    };
  }

  public static buildDocument(
    tableName: string,
    persistence: DocumentInterface,
  ) {
    return {
      Put: {
        TableName: tableName,
        Item: marshall(
          DocumentSchema.parse({
            PK: DynamoKeys.documentPK(persistence.id),
            SK: DynamoKeys.documentSK(persistence.id),
            itemType: DynamoItemType.Document,
            ...DocumentMapper.toPersistence(persistence),
            createdAt: new Date().toISOString(),
            updatedAt: null,
            deletedAt: null,
          }),
        ),
        ConditionExpression:
          'attribute_not_exists(PK) AND attribute_not_exists(SK)',
      },
    };
  }

  public static buildDocumentValueLookup(
    tableName: string,
    persistence: DocumentInterface,
  ) {
    return {
      Put: {
        TableName: tableName,
        Item: marshall(
          DocumentValueLookup.parse({
            PK: DynamoKeys.documentValuePK(persistence.value),
            SK: DynamoKeys.documentValueSK(),
            itemType: DynamoItemType.DocumentValueLookup,
            id: persistence.id,
            customerId: persistence.customerId,
            type: persistence.type,
            value: persistence.value,
          }),
        ),
        ConditionExpression:
          'attribute_not_exists(PK) AND attribute_not_exists(SK)',
      },
    };
  }

  public static buildCustomerDocumentTypeLookup(
    tableName: string,
    persistence: DocumentInterface,
  ) {
    return {
      Put: {
        TableName: tableName,
        Item: marshall(
          CustomerDocumentTypeLookup.parse({
            PK: DynamoKeys.customerDocumentTypePK(
              persistence.customerId,
              persistence.type,
            ),
            SK: DynamoKeys.customerDocumentTypeSK(),
            itemType: DynamoItemType.CustomerDocumentTypeLookup,
            id: persistence.id,
            customerId: persistence.customerId,
            type: persistence.type,
          }),
        ),
        ConditionExpression:
          'attribute_not_exists(PK) AND attribute_not_exists(SK)',
      },
    };
  }

  public static buildCustomerDocumentIdLookup(
    tableName: string,
    persistence: DocumentInterface,
  ) {
    return {
      Put: {
        TableName: tableName,
        Item: marshall(
          CustomerDocumentIdLookup.parse({
            PK: DynamoKeys.customerDocumentIdPK(persistence.id),
            SK: DynamoKeys.customerDocumentIdSK(),
            itemType: DynamoItemType.CustomerDocumentIdLookup,
            id: persistence.id,
            customerId: persistence.customerId,
            type: persistence.type,
            value: persistence.value,
          }),
        ),
        ConditionExpression:
          'attribute_not_exists(PK) AND attribute_not_exists(SK)',
      },
    };
  }
}
