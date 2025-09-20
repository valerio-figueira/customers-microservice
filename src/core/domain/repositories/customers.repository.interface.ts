import { Customer } from '../entities/customer.entity';
import { PersistedCustomerInterface } from '../entities/interfaces/customer.interface';

/**
 * @interface CustomerRepository
 * @description
 * Esta interface define a porta de saída para o repositório de clientes.
 * Ela abstrai a lógica de persistência de dados, garantindo que a camada de domínio
 * não tenha conhecimento da infraestrutura (e.g., banco de dados).
 */
export interface CustomerRepositoryInterface {
  save(
    customer: Customer,
  ): Promise<Omit<PersistedCustomerInterface, 'password'>>;

  findById(
    id: string,
  ): Promise<Omit<PersistedCustomerInterface, 'password'> | null>;

  existsEmail(email: string): Promise<boolean>;
}
