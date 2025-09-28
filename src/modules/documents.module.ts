import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { PrismaConnection } from '../infra/database/prisma/prisma.connection';
import {
  CREATE_DOCUMENT_USECASE,
  ID_GENERATOR,
  PRISMA_UNIT_OF_WORK,
} from '../infra/config/tokens';
import { UnitOfWorkInterface } from '../core/app/ports/unit-of-work.interface';
import { IdGeneratorInterface } from '../core/app/ports/id-generator.interface';
import { CreateDocumentUseCase } from '../core/app/usecases/create-document/create-document.usecase';
import { IdGeneratorModule } from './id-generator.module';
import { AwsModule } from './aws.module';

@Module({
  imports: [PrismaModule, AwsModule, IdGeneratorModule],
  providers: [
    PrismaConnection,
    {
      provide: CREATE_DOCUMENT_USECASE,
      useFactory: (
        unitOfWork: UnitOfWorkInterface,
        idGenerator: IdGeneratorInterface,
      ) => new CreateDocumentUseCase(unitOfWork, idGenerator),
      inject: [PRISMA_UNIT_OF_WORK, ID_GENERATOR],
    },
  ],
  exports: [CREATE_DOCUMENT_USECASE],
})
export class DocumentsModule {}
