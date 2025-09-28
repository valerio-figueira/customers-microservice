import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma.module';
import { CustomersController } from './infra/http/customers.controller';
import { PrismaConnection } from './infra/database/prisma/prisma.connection';
import { DocumentsController } from './infra/http/documents.controller';
import { RabbitMqModule } from './modules/rabbitmq.module';
import { AwsModule } from './modules/aws.module';
import { CustomersModule } from './modules/customers.module';
import { DocumentsModule } from './modules/documents.module';

@Module({
  imports: [
    PrismaModule,
    RabbitMqModule,
    AwsModule,
    CustomersModule,
    DocumentsModule,
  ],
  controllers: [CustomersController, DocumentsController],
  providers: [PrismaConnection],
  exports: [],
})
export class AppModule {}
