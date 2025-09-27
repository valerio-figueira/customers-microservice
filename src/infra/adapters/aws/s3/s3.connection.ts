import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export abstract class S3Connection {
  private readonly _client: S3Client;
  private readonly _configService = new ConfigService();

  protected constructor() {
    this._client = new S3Client({
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

  public get client(): S3Client {
    return this._client;
  }
}
