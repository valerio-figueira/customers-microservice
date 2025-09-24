import {
  PublisherOptions,
  MessageBrokerPublisherInterface,
} from '../../../core/app/ports/message-broker.interface';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RabbitMQServices } from './enums/rabbitmq.enum';
import { firstValueFrom } from 'rxjs';
import { ApplicationInternalError } from '../../../core/app/exceptions/application-internal.error';

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
      await firstValueFrom(
        this.client.emit(options.operation, JSON.stringify(options.message)),
      );
    } catch (error) {
      this.logger.error(`Erro ao publicar mensagem RabbitMQ: ${error}`);
      throw new ApplicationInternalError('Erro ao publicar mensagem RabbitMQ');
    }
  }
}
