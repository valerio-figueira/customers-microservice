export interface CreateAddressUseCaseInterface {
  create: (input: CreateAddressInput) => Promise<CreateAddressOutput>;
}

export interface CreateAddressInput {
  customerId: string;
  street: string;
  number: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface CreateAddressOutput {
  id: string;
  customerId: string;
  street: string;
  number: string;
  neighborhood: string;
  zipcode: string;
  city: string;
  state: string;
  isDefault: boolean;
}
