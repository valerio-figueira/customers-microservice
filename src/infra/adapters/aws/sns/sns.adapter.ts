import { Injectable, Logger } from '@nestjs/common';
import { PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import {
  PublisherOptions,
  MessageBrokerPublisherInterface,
} from '../../../../core/app/ports/message-broker.interface';
import { SNSConnection } from './sns.connection';

@Injectable()
export class SNSAdapter
  extends SNSConnection
  implements MessageBrokerPublisherInterface
{
  private readonly _topicArn: string;

  constructor(
    private configService: ConfigService,
    private readonly logger: Logger,
  ) {
    super();
    this._topicArn = this.configService.get('SNS_TOPIC_ARN')!;
  }

  public async publish(options: PublisherOptions): Promise<void> {
    const params: PublishCommandInput = {
      TopicArn: this._topicArn,
      Message: JSON.stringify(options.message),
      Subject: options.subject,
    };

    try {
      await this.client.send(new PublishCommand(params));
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
