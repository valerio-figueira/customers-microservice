import {
  CreateAddressInput,
  CreateAddressOutput,
  CreateAddressInterface,
} from './create-address.interface';

export class CreateAddressUseCase implements CreateAddressInterface {
  public create(input: CreateAddressInput): Promise<CreateAddressOutput> {
    return new Promise<CreateAddressOutput>((resolve) => {
      resolve({ id: 'addr_123', ...input });
    });
  }
}
