import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';

export abstract class DynamoDbConnection {
  private readonly _client: DynamoDBClient;
  private readonly _configService = new ConfigService();

  protected constructor() {
    this._client = new DynamoDBClient({
      endpoint: this._configService.get<string>('AWS_ENDPOINT'),
      region: this._configService.get<string>('AWS_REGION')!,
      credentials: {
        accountId: this._configService.get<string>('AWS_ACCOUNT'),
        accessKeyId: this._configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this._configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  public get client(): DynamoDBClient {
    return this._client;
  }
}
