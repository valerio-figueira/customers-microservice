import { Module } from '@nestjs/common';
import { MESSAGE_BROKER_PUBLISHER } from '../infra/config/tokens';
import { ClientProxy, ClientsModule } from '@nestjs/microservices';
import { RabbitMQPublisherAdapter } from '../infra/adapters/rabbitmq/rabbitmq-publisher.adapter';
import { RabbitMQServices } from '../infra/adapters/rabbitmq/enums/rabbitmq.enum';
import { RabbitMQConfig } from '../infra/config/rabbitmq.config';

@Module({
  imports: [ClientsModule.register([RabbitMQConfig])],
  providers: [
    {
      provide: MESSAGE_BROKER_PUBLISHER,
      useFactory: (clientProxy: ClientProxy) =>
        new RabbitMQPublisherAdapter(clientProxy),
      inject: [RabbitMQServices.CUSTOMERS_RMQ],
    },
  ],
  exports: [MESSAGE_BROKER_PUBLISHER],
})
export class RabbitMqModule {}
