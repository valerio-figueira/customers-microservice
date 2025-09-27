import { SNSClient } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';

export abstract class SQSConnection {
  private readonly _client: SNSClient;
  private readonly _configService = new ConfigService();

  protected constructor() {
    this._client = new SNSClient({
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

  public get client(): SNSClient {
    return this._client;
  }
}
