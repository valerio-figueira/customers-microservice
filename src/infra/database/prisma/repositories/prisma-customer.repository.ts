import { CustomerRepositoryInterface } from '../../../../core/app/ports/repositories/customers.repository.interface';
import { Customer } from '../../../../core/domain/entities/customer.entity';
import { PrismaConnection } from '../prisma.connection';
import { CustomerMapper } from '../../../mappers/customer.mapper';
import { PrismaTransaction } from './prisma-unit-of-work';
import { CustomerInterface } from '../../../../core/domain/entities/interfaces/customer.interface';
import { DocumentMapper } from '../../../mappers/document.mapper';
import { RepositoryInternalError } from '../../../../core/app/exceptions/repository-internal.error';

export class PrismaCustomerRepository implements CustomerRepositoryInterface {
  constructor(private readonly prisma: PrismaConnection | PrismaTransaction) {}

  public async save(customer: Customer): Promise<CustomerInterface> {
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
      throw new RepositoryInternalError(
        `Erro de persistência - Usuário não encontrado: ${id}`,
      );
    }

    return persisted;
  }

  public async findById(id: string): Promise<CustomerInterface | null> {
    const persistence = await this.prisma.customer.findUnique({
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
    if (!persistence) return null;
    return CustomerMapper.toDomain(persistence);
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
  ): Promise<CustomerInterface> {
    const persistence = await this.prisma.customer.update({
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
    return CustomerMapper.toDomain(persistence);
  }
}
