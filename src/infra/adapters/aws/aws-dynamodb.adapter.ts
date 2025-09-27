import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Logger } from '@nestjs/common';
import { AwsConnection } from './aws.connection';

export class AwsDynamoDbAdapter {
  constructor(
    private readonly awsConnection: AwsConnection<DynamoDBClient>,
    private readonly logger: Logger,
  ) {}

  private get client(): DynamoDBClient {
    return this.awsConnection.client;
  }

  public async putItem(
    tableName: string,
    item: Record<string, any>,
  ): Promise<void> {
    this.logger.log(`[DynamoDB] PutItem into table: ${tableName}`);

    await this.client.send(
      new PutItemCommand({
        TableName: tableName,
        Item: item,
      }),
    );
  }

  public async getItem(
    tableName: string,
    key: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    this.logger.log(`[DynamoDB] GetItem from table: ${tableName}`);

    const result = await this.client.send(
      new GetItemCommand({
        TableName: tableName,
        Key: key,
      }),
    );

    return result.Item ?? null;
  }

  public async deleteItem(
    tableName: string,
    key: Record<string, any>,
  ): Promise<void> {
    this.logger.log(`[DynamoDB] DeleteItem from table: ${tableName}`);

    await this.client.send(
      new DeleteItemCommand({
        TableName: tableName,
        Key: key,
      }),
    );
  }
}
