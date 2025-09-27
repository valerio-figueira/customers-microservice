import {
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  TransactWriteItem,
  TransactWriteItemsCommand,
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { RepositoryInternalError } from '../../../../core/app/exceptions/repository-internal.error';
import { DynamoDbConnection } from './dynamodb.connection';
import { Logger } from '@nestjs/common';

export class DynamoDbAdapter extends DynamoDbConnection {
  private readonly logger = new Logger(DynamoDbAdapter.name);

  constructor() {
    super();
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
      this.logger.log(
        `[DynamoDB] - GetItem Command: ${JSON.stringify(command)}`,
      );
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
      this.logger.log(`[DynamoDB] - Query Command: ${JSON.stringify(command)}`);
      const output: QueryCommandOutput = await this.client.send<
        QueryCommandInput,
        QueryCommandOutput
      >(command);
      return output.Items || null;
    } catch (error) {
      this.handleError('QueryItems', error);
    }
  }

  private handleError(operation: string, error: unknown): never {
    this.logger.error(`[DynamoDB][ERROR] ${operation}`, error);
    throw new RepositoryInternalError(`[DynamoDB][ERROR] ${operation}.`);
  }
}
