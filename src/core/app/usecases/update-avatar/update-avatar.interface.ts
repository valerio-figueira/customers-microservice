import { CustomerInterface } from '../../../domain/entities/interfaces/customer.interface';

export interface UpdateAvatarUseCaseInterface {
  update(input: UpdateAvatarInput): Promise<UpdateAvatarOutput>;
}

export interface UpdateAvatarInput {
  customerId: string;

  /*
   * Buffer, stream ou até string base64
   */
  file: Buffer;

  /*
   * ContentType: (image/jpeg, image/png, etc.)
   */
  contentType: string;
}

export type UpdateAvatarOutput = Omit<CustomerInterface, 'password'>;
