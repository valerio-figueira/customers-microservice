import { ConfigService } from '@nestjs/config';

export class AwsConnection<AWSClient> {
  private readonly _client: AWSClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly ClientClass: new (config: object) => AWSClient,
  ) {
    this._client = new ClientClass({
      region: this.configService.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  public get client(): AWSClient {
    return this._client;
  }
}
