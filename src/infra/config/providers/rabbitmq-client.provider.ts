import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RabbitMQServices } from '../../adapters/rabbitmq/enums/rabbitmq.enum';

export const RabbitMQClientProvider = {
  provide: RabbitMQServices.CUSTOMERS_RMQ,
  useFactory: () => {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_MQ_URL_01 || 'amqp://localhost:5672'],
        queue: 'customers_queue',
        queueOptions: { durable: true },
        exchange: 'customers_exchange',
        exchangeType: 'topic',
      },
    });
  },
};
