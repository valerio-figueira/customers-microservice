import { UnitOfWorkInterface } from '../../ports/unit-of-work.interface';
import { FileStorageInterface } from '../../ports/file-storage.interface';
import {
  UpdateAvatarInput,
  UpdateAvatarInterface,
  UpdateAvatarOutput,
} from './update-avatar.interface';
import { ApplicationValidationError } from '../../commons/errors/errors';
import { Avatar } from '../../../domain/entities/avatar.entity';

export class UpdateAvatarUseCase implements UpdateAvatarInterface {
  constructor(
    private readonly unitOfWork: UnitOfWorkInterface,
    private readonly fileStorage: FileStorageInterface,
  ) {}

  public async update(input: UpdateAvatarInput): Promise<UpdateAvatarOutput> {
    const { customerId, file, contentType } = input;

    const type = contentType?.split(/\//)[1];
    const avatarPath = `profiles/${customerId}.${type}`;
    const avatar = new Avatar({ path: avatarPath });

    return this.unitOfWork.execute(async (repositories) => {
      const exists = await repositories.customers.exists(customerId);
      if (!exists) {
        throw new ApplicationValidationError('Cliente não encontrado.');
      }

      await this.fileStorage.upload(avatar.path, file, { contentType });
      return repositories.customers.updateAvatarPath(customerId, avatarPath);
    });
  }
}
