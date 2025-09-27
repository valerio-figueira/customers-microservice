import { ConfigService } from '@nestjs/config';
import { SNSClient } from '@aws-sdk/client-sns';

export abstract class SNSConnection {
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
