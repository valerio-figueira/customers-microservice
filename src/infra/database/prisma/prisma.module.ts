import { Global, Module } from '@nestjs/common';
import { PrismaConnection } from './prisma.connection';

@Global()
@Module({
  providers: [PrismaConnection],
  exports: [PrismaConnection],
})
export class PrismaModule {}
