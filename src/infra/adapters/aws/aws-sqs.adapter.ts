import {
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Logger } from '@nestjs/common';
import {
  ConsumedQueueMessage,
  QueueClientInterface,
  QueueReceiveOptions,
  QueueSendOptions,
} from '../../../core/app/ports/queue-client.interface';
import { AwsConnection } from './aws.connection';

export class AwsSQSAdapter implements QueueClientInterface {
  constructor(
    private readonly awsConnection: AwsConnection<SQSClient>,
    private readonly logger: Logger,
  ) {}

  private get client(): SQSClient {
    return this.awsConnection.client;
  }

  public async receiveMessages<T>(
    options: QueueReceiveOptions,
  ): Promise<ConsumedQueueMessage<T>[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: options.queueUrl,
      MaxNumberOfMessages: options?.maxNumberOfMessages || 1,
      WaitTimeSeconds: 10,
    });
    const output = await this.client.send(command);
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

    await this.client.send(
      new SendMessageCommand({
        QueueUrl: options.queueUrl,
        MessageBody: JSON.stringify(options.message),
      }),
    );
  }
}
