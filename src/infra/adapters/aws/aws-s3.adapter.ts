import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { FileStorageInterface } from '../../../core/app/ports/file-storage.interface';
import { ConfigService } from '@nestjs/config';
import { AwsConnection } from './aws.connection';

export class AwsS3Adapter implements FileStorageInterface {
  private readonly _bucketName: string;

  constructor(
    private readonly awsConnection: AwsConnection<S3Client>,
    private readonly configService: ConfigService,
  ) {
    this._bucketName = this.configService.get<string>('BUCKET_NAME')!;
    Object.freeze(this);
  }

  private get client(): S3Client {
    return this.awsConnection.client;
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
    await this.client.send(command);
  }

  public async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this._bucketName,
      Key: key,
    });

    const response = await this.client.send(command);
    return response.Body?.transformToByteArray()
      ? Buffer.from(await response.Body.transformToByteArray())
      : Buffer.from([]);
  }

  public async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this._bucketName,
      Key: key,
    });
    await this.client.send(command);
  }
}
