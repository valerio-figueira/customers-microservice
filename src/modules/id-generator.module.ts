import { Module } from '@nestjs/common';
import { ID_GENERATOR } from '../infra/config/tokens';
import { UlidGeneratorAdapter } from '../infra/adapters/ids/ulid-generator.adapter';

@Module({
  imports: [],
  providers: [
    { provide: ID_GENERATOR, useFactory: () => new UlidGeneratorAdapter() },
  ],
  exports: [ID_GENERATOR],
})
export class IdGeneratorModule {}
