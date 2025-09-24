import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ApplicationErrorFilter } from './infra/http/exceptions/http-filter.exception';
import { RabbitMQServices } from './infra/adapters/rabbitmq/enums/rabbitmq.enum';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix(process.env.MICROSERVICE_NAME || `customers`);
  app.useGlobalFilters(new ApplicationErrorFilter());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      name: RabbitMQServices.CUSTOMERS_RMQ,
      urls: [process.env.RABBIT_MQ_URL_01 || 'amqp://localhost:5672'],
      queueOptions: {
        durable: true,
      },
      exchange: 'customers_exchange',
      exchangeType: 'topic',
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
