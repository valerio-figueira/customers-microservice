import {
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import {
  ConsumedQueueMessage,
  QueueClientInterface,
  QueueReceiveOptions,
  QueueSendOptions,
} from '../../../core/app/ports/queue-client.interface';

export class AwsSQSAdapter implements QueueClientInterface {
  private readonly _client: SQSClient;

  constructor(
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this._client = new SQSClient({
      region: this.configService.get('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  public async receiveMessages<T>(
    options: QueueReceiveOptions,
  ): Promise<ConsumedQueueMessage<T>[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: options.queueUrl,
      MaxNumberOfMessages: options?.maxNumberOfMessages || 1,
      WaitTimeSeconds: 10,
    });
    const output = await this._client.send(command);
    return (output.Messages || []).map((message) => {
      if (!message?.Body) {
        throw new Error('[SQS] Message Body is empty.');
      }
      return {
        messageId: message?.MessageId,
        body: JSON.parse(message.Body) as T,
        receiptHandle: message?.ReceiptHandle,
      };
    });
  }

  public async sendMessage<T>(options: QueueSendOptions<T>): Promise<void> {
    if (!options?.queueUrl) {
      throw new Error('[SQS] - Missing QueueUrl');
    }
    this.logger.log(`[SQS] Publishing message to queue: ${options.queueUrl}.`);

    await this._client.send(
      new SendMessageCommand({
        QueueUrl: options.queueUrl,
        MessageBody: JSON.stringify(options.message),
      }),
    );
  }
}
