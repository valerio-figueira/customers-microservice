import { CustomerRepositoryInterface } from '../../../../core/domain/repositories/customers.repository.interface';
import { Customer } from '../../../../core/domain/entities/customer.entity';
import { PrismaConnection } from '../prisma.connection';
import { CustomerMapper } from '../../../../core/app/mappers/customer.mapper';
import { PrismaTransaction } from './prisma-unit-of-work';
import { PersistedCustomerInterface } from '../../../../core/domain/entities/interfaces/customer.interface';
import { DocumentMapper } from '../../../../core/app/mappers/document.mapper';
import { ApplicationNotFoundError } from '../../../../core/app/commons/errors/errors';

export class PrismaCustomerRepository implements CustomerRepositoryInterface {
  constructor(private readonly prisma: PrismaConnection | PrismaTransaction) {}

  public async save(
    customer: Customer,
  ): Promise<Omit<PersistedCustomerInterface, 'password'>> {
    const { id } = await this.prisma.customer.create({
      data: CustomerMapper.toPersistence(customer),
      select: { id: true },
    });

    await Promise.all(
      customer.documents.map(async (d) =>
        this.prisma.document.create({
          data: DocumentMapper.toPersistence(d),
        }),
      ),
    );

    const persisted = await this.findById(id);

    if (!persisted) {
      throw new ApplicationNotFoundError(
        `Erro de persistência - Usuário não encontrado: ${id}`,
      );
    }

    return persisted;
  }

  public async findById(
    id: string,
  ): Promise<Omit<PersistedCustomerInterface, 'password'> | null> {
    return this.prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        gender: true,
        phone: true,
        dateOfBirth: true,
        email: true,
        documents: true,
        avatarPath: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  public async exists(id: string): Promise<boolean> {
    const exists = await this.prisma.customer.findFirst({
      where: { id },
      select: { id: true },
    });
    return !!exists;
  }

  public async existsEmail(email: string): Promise<boolean> {
    const exists = await this.prisma.customer.findFirst({
      where: { email },
      select: { id: true },
    });
    return !!exists;
  }

  public async updateAvatarPath(
    id: string,
    avatarPath: string,
  ): Promise<Omit<PersistedCustomerInterface, 'password'>> {
    return this.prisma.customer.update({
      where: { id },
      data: { avatarPath },
      select: {
        id: true,
        name: true,
        gender: true,
        phone: true,
        dateOfBirth: true,
        email: true,
        avatarPath: true,
        documents: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }
}
