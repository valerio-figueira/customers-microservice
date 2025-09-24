import {
  PublisherOptions,
  MessageBrokerInterface,
} from '../../../core/app/ports/message-broker.interface';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { RabbitMQServices } from './enums/rabbitmq.enum';

@Injectable()
export class RabbitMQAdapter implements MessageBrokerInterface {
  constructor(
    @Inject(RabbitMQServices.CUSTOMERS_RMQ) private client: ClientProxy,
  ) {}

  public async publish(options: PublisherOptions): Promise<void> {
    this.client.emit(options.operation, JSON.stringify(options.message));
  }
}
