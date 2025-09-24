import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma';

@Injectable()
export class PrismaConnection
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
