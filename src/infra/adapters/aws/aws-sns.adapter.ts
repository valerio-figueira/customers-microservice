import { Injectable, Logger } from '@nestjs/common';
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import {
  PublisherOptions,
  MessageBrokerInterface,
} from '../../../core/app/ports/message-broker.interface';

@Injectable()
export class AwsSNSAdapter implements MessageBrokerInterface {
  private readonly _client: SNSClient;
  private readonly _topicArn: string;

  constructor(
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this._topicArn = this.configService.get('SNS_TOPIC_ARN')!;
    this._client = new SNSClient({
      region: this.configService.get('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  public async publish(options: PublisherOptions): Promise<void> {
    const params: PublishCommandInput = {
      TopicArn: this._topicArn,
      Message: JSON.stringify(options.message),
      Subject: options.subject,
    };

    try {
      await this._client.send(new PublishCommand(params));
      this.logger.log(
        `Mensagem publicada com sucesso no tópico: ${this._topicArn}`,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao publicar mensagem no tópico ${this._topicArn}:`,
        error,
      );
      throw new Error('Falha ao enviar mensagem para o SNS.');
    }
  }
}
