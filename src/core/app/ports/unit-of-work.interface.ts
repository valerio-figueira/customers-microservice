import { CustomerRepositoryInterface } from './repositories/customers.repository.interface';
import { DocumentRepositoryInterface } from './repositories/document.repository.interface';

export interface UnitOfWorkInterface {
  execute<T>(
    work: (repositories: RepositoryFactoryInterface) => Promise<T>,
  ): Promise<T>;
}

export interface RepositoryFactoryInterface {
  customers: CustomerRepositoryInterface;
  documents: DocumentRepositoryInterface;
}
