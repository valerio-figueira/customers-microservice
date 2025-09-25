import {
  MessageBrokerExchanges,
  MessageBrokerQueues,
  RabbitMQServices,
} from '../adapters/rabbitmq/enums/rabbitmq.enum';
import {
  ClientOptions,
  ClientProviderOptions,
  Transport,
} from '@nestjs/microservices';

export const RabbitMQConfig = <ClientOptions & ClientProviderOptions>{
  name: RabbitMQServices.CUSTOMERS_RMQ,
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBIT_MQ_URL_01 || 'amqp://localhost:5672'],
    queue: MessageBrokerQueues.CUSTOMERS_QUEUE,
    queueOptions: { durable: true },
    exchange: MessageBrokerExchanges.CUSTOMERS_EXCHANGE,
    exchangeType: 'topic',
    noAck: true,
    wildcards: true,
    retryAttempts: 10,
  },
};
