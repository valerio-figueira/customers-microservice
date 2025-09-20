import {
  CustomerInterface,
  PersistedCustomerInterface,
} from '../../domain/entities/interfaces/customer.interface';

export class CustomerMapper {
  /**
   * Converte um objeto de domínio em um objeto persistido.
   */
  static toPersistence(
    customer: CustomerInterface,
  ): Omit<PersistedCustomerInterface, 'documents'> {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email.value,
      password: customer.password,
      phone: customer.phone.value,
      gender: customer.gender.value,
      dateOfBirth: customer.dateOfBirth,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
  }
}
