import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  QueryCommand,
  QueryCommandOutput,
  TransactWriteItem,
  TransactWriteItemsCommand,
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { Logger } from '@nestjs/common';
import { AwsConnection } from '../aws.connection';
import { RepositoryInternalError } from '../../../../core/app/exceptions/repository-internal.error';

export class AwsDynamoDbAdapter {
  constructor(
    private readonly awsConnection: AwsConnection<DynamoDBClient>,
    private readonly logger: Logger,
  ) {}

  private get client(): DynamoDBClient {
    return this.awsConnection.client;
  }

  public async transactWriteItem(
    TransactItems: TransactWriteItem[],
  ): Promise<void> {
    try {
      await this.client.send(new TransactWriteItemsCommand({ TransactItems }));
    } catch (error) {
      this.handleError('TransactWriteItem', error);
    }
  }

  public async updateItem(
    command: UpdateItemCommand,
  ): Promise<UpdateItemCommandOutput> {
    try {
      return this.client.send<UpdateItemCommandInput, UpdateItemCommandOutput>(
        command,
      );
    } catch (error) {
      this.handleError('UpdateItem', error);
    }
  }

  public async putItem(
    command: PutItemCommand,
  ): Promise<UpdateItemCommandOutput> {
    try {
      return this.client.send<PutItemCommandInput, PutItemCommandOutput>(
        command,
      );
    } catch (error) {
      this.handleError('PutItem', error);
    }
  }

  public async getItem(
    command: GetItemCommand,
  ): Promise<Record<string, any> | null> {
    try {
      const output: GetItemCommandOutput = await this.client.send(command);
      return output.Item || null;
    } catch (error) {
      this.handleError('GetItem', error);
    }
  }

  public async queryItems(
    command: QueryCommand,
  ): Promise<Record<string, any>[] | null> {
    try {
      const output: QueryCommandOutput = await this.client.send(command);
      return output.Items || null;
    } catch (error) {
      this.handleError('QueryItems', error);
    }
  }

  private handleError(operation: string, error: unknown): never {
    this.logger.error(`[DynamoDB] ${operation} failed on table`, error);
    throw new RepositoryInternalError(
      `[DynamoDBAdapter] ${operation} failed: ${JSON.stringify(error)}`,
    );
  }
}
