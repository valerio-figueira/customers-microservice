import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { FileStorageInterface } from '../../../core/app/ports/file-storage.interface';
import { ConfigService } from '@nestjs/config';

export class AwsS3Adapter implements FileStorageInterface {
  private readonly _client: S3Client;
  private readonly _bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this._bucketName = this.configService.get<string>('BUCKET_NAME')!;
    this._client = new S3Client({
      region: this.configService.get('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
    Object.freeze(this);
  }

  public async upload(
    key: string,
    content: Buffer | string,
    options?: { contentType?: string },
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this._bucketName,
      Key: key,
      Body: content,
      ContentType: options?.contentType,
    });
    await this._client.send(command);
  }

  public async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this._bucketName,
      Key: key,
    });

    const response = await this._client.send(command);
    return response.Body?.transformToByteArray()
      ? Buffer.from(await response.Body.transformToByteArray())
      : Buffer.from([]);
  }

  public async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this._bucketName,
      Key: key,
    });
    await this._client.send(command);
  }
}
