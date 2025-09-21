import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { FileStorageInterface } from '../../core/app/ports/file-storage.interface';
import { ConfigService } from '@nestjs/config';

export class S3AwsConnection implements FileStorageInterface {
  private readonly client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    const bucketName = this.configService.get<string>('BUCKET_NAME');
    const region = this.configService.get<string>('REGION');
    if (!bucketName) {
      throw new Error(
        'O campo bucket-name é obrigatório na configuração do S3.',
      );
    }
    if (!region) {
      throw new Error('O campo Region é obrigatório na configuração do S3.');
    }
    this.region = region;
    this.bucketName = bucketName;
    this.client = new S3Client({ region });
    Object.freeze(this);
  }

  public async upload(
    key: string,
    content: Buffer | string,
    options?: { contentType?: string },
  ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: content,
      ContentType: options?.contentType,
    });
    await this.client.send(command);
  }

  public async download(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.client.send(command);
    return response.Body?.transformToByteArray()
      ? Buffer.from(await response.Body.transformToByteArray())
      : Buffer.from([]);
  }

  public async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.client.send(command);
  }
}
