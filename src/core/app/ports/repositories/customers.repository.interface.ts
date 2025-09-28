import { Customer } from '../../../domain/entities/customer.entity';
import { CustomerInterface } from '../../../domain/entities/interfaces/customer.interface';

/**
 * @interface CustomerRepository
 * @description
 * Esta interface define a porta de saída para o repositório de clientes.
 * Ela abstrai a lógica de persistência de dados, garantindo que a camada de domínio
 * não tenha conhecimento da infraestrutura (e.g., banco de dados).
 */
export interface CustomerRepositoryInterface {
  save(customer: Customer): Promise<CustomerInterface>;

  findById(id: string): Promise<CustomerInterface | null>;

  exists(id: string): Promise<boolean>;

  existsEmail(email: string): Promise<boolean>;

  updateAvatarPath(id: string, avatarPath: string): Promise<CustomerInterface>;
}
