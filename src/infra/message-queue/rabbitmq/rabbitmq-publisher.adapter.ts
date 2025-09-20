import {
  NotificationParams,
  NotificationPublisherInterface,
} from '../../../core/app/ports/notification-publisher.interface';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { RabbitMQServices } from './enums/rabbitmq.enum';

@Injectable()
export class RabbitMQPublisherAdapter implements NotificationPublisherInterface {
  constructor(
    @Inject(RabbitMQServices.CUSTOMERS_RMQ) private client: ClientProxy,
  ) {}

  public publish(params: NotificationParams): void {
    this.client.emit(params.operation, params.message);
  }
}
