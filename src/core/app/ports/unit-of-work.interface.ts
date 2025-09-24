import { CustomerRepositoryInterface } from './repositories/customers.repository.interface';
import { DocumentRepositoryInterface } from './repositories/document.repository.interface';

export interface UnitOfWorkInterface {
  execute<T>(work: (repositories: RepositoryFactory) => Promise<T>): Promise<T>;
}

export interface RepositoryFactory {
  customers: CustomerRepositoryInterface;
  documents: DocumentRepositoryInterface;
}
