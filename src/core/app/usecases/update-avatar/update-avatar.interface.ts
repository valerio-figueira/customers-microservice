import { PersistedCustomerInterface } from '../../../domain/entities/interfaces/customer.interface';

export interface UpdateAvatarInterface {
  update(input: UpdateAvatarInput): Promise<UpdateAvatarOutput>;
}

export interface UpdateAvatarInput {
  customerId: string;
  file: Buffer; // Buffer, stream ou até string base64
  contentType?: string; // opcional (image/jpeg, image/png, etc.)
}

export type UpdateAvatarOutput = Omit<PersistedCustomerInterface, 'password'>;
