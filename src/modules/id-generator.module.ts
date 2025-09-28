import { Module } from '@nestjs/common';
import { ID_GENERATOR } from '../infra/config/tokens';
import { IdGeneratorAdapter } from '../infra/adapters/ids/id-generator.adapter';

@Module({
  imports: [],
  providers: [
    { provide: ID_GENERATOR, useFactory: () => new IdGeneratorAdapter() },
  ],
  exports: [ID_GENERATOR],
})
export class IdGeneratorModule {}
