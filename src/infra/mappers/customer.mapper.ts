import {
  CustomerInterface,
  PersistedCustomerInterface,
} from '../../core/domain/entities/interfaces/customer.interface';
import { PersistedDocumentInterface } from '../../core/domain/entities/interfaces/document.interface';
import { CustomerBuilder } from '../../core/domain/builders/customer.builder';
import { Customer } from '../../core/domain/entities/customer.entity';

export class CustomerMapper {
  /**
   * Converte um objeto de domínio em um objeto persistido.
   */
  static toPersistence(
    customer: CustomerInterface,
  ): Omit<
    PersistedCustomerInterface,
    'documents' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email.value,
      password: customer.password.hash,
      phone: customer.phone.value,
      gender: customer.gender.value,
      dateOfBirth: customer.dateOfBirth.value,
      avatarPath: customer.avatar.path,
    };
  }

  static toDomain(
    customer: Omit<PersistedCustomerInterface, 'password'>,
  ): Customer {
    return new CustomerBuilder()
      .withId(customer.id)
      .withName(customer.name)
      .withEmail(customer.email)
      .withGender(customer.gender)
      .withPhone(customer.phone)
      .withDocuments(customer.documents)
      .withDateOfBirth(customer.dateOfBirth)
      .build();
  }

  static fromDynamo(
    metadata: PersistedCustomerInterface,
    documents: PersistedDocumentInterface[],
  ): Omit<PersistedCustomerInterface, 'password'> {
    Reflect.deleteProperty(metadata, 'password');
    return {
      id: metadata.id,
      name: metadata.name,
      email: metadata.email,
      gender: metadata.gender,
      phone: metadata.phone,
      dateOfBirth: metadata.dateOfBirth,
      avatarPath: metadata.avatarPath,
      documents: documents.map((doc: PersistedDocumentInterface) => ({
        id: doc.id,
        customerId: doc.customerId,
        type: doc.type,
        value: doc.value,
        issueDate: doc.issueDate,
        issuingAuthority: doc.issuingAuthority,
        expirationDate: doc.expirationDate,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        deletedAt: doc.deletedAt,
      })),
      createdAt: metadata.createdAt,
      updatedAt: metadata.updatedAt,
      deletedAt: metadata.deletedAt,
    };
  }
}
