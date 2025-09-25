import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApplicationErrorFilter } from './infra/http/exceptions/http-filter.exception';
import { RabbitMQConfig } from './infra/config/rabbitmq.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix(process.env.MICROSERVICE_NAME || `customers`);
  app.useGlobalFilters(new ApplicationErrorFilter());

  app.connectMicroservice(RabbitMQConfig);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
