import {
  CreateAddressInput,
  CreateAddressOutput,
  CreateAddressUseCaseInterface,
} from './interfaces/create-address-use-case.interface';

export class CreateAddressUseCase implements CreateAddressUseCaseInterface {
  public create(input: CreateAddressInput): Promise<CreateAddressOutput> {
    return new Promise<CreateAddressOutput>((resolve) => {
      resolve({ id: 'addr_123', ...input });
    });
  }
}
