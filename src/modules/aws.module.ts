import { Module } from '@nestjs/common';
import { DynamoDbModule } from './dynamodb.module';

@Module({
  imports: [DynamoDbModule],
  providers: [],
  exports: [DynamoDbModule],
})
export class AwsModule {}
