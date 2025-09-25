import {
  PublisherOptions,
  MessageBrokerPublisherInterface,
} from '../../../core/app/ports/message-broker.interface';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ApplicationInternalError } from '../../../core/app/exceptions/application-internal.error';
import { RabbitMQServices } from './enums/rabbitmq.enum';

@Injectable()
export class RabbitMQPublisherAdapter
  implements MessageBrokerPublisherInterface
{
  private readonly logger = new Logger(RabbitMQPublisherAdapter.name);

  constructor(
    @Inject(RabbitMQServices.CUSTOMERS_RMQ) private client: ClientProxy,
  ) {}

  public async publish(options: PublisherOptions): Promise<void> {
    try {
      this.logger.log(`Publishing message with pattern: ${options.pattern}`);
      await firstValueFrom(
        this.client.emit(options.pattern, JSON.stringify(options.message)),
      );
    } catch (error) {
      this.logger.error(`Erro ao publicar mensagem RabbitMQ: ${error}`);
      throw new ApplicationInternalError('Erro ao publicar mensagem RabbitMQ');
    }
  }
}
