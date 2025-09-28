import { UnitOfWorkInterface } from '../../ports/unit-of-work.interface';
import { FileStorageInterface } from '../../ports/file-storage.interface';
import {
  UpdateAvatarInput,
  UpdateAvatarUseCaseInterface,
  UpdateAvatarOutput,
} from './update-avatar.interface';
import { Avatar } from '../../../domain/entities/value-objects/avatar.vo';
import { ImageProcessorInterface } from '../../ports/image-processor.interface';
import { ApplicationValidationError } from '../../exceptions/application-validation.error';

export class UpdateAvatarUseCase implements UpdateAvatarUseCaseInterface {
  constructor(
    private readonly unitOfWork: UnitOfWorkInterface,
    private readonly fileStorage: FileStorageInterface,
    private readonly imageProcessor: ImageProcessorInterface,
  ) {}

  public async update(input: UpdateAvatarInput): Promise<UpdateAvatarOutput> {
    const { customerId, file, contentType } = input;

    const type = contentType?.split(/\//)[1];
    const avatarPath = `profiles/${customerId}.${type}`;
    const avatar = new Avatar({ path: avatarPath });
    const optimizedFile = await this.imageProcessor.toFormat(file, 'webp');

    return this.unitOfWork.execute(async (repositories) => {
      const exists = await repositories.customers.exists(customerId);
      if (!exists) {
        throw new ApplicationValidationError('Cliente não encontrado.');
      }

      await this.fileStorage.upload(avatar.getPathOrThrow(), optimizedFile, {
        contentType,
      });
      return repositories.customers.updateAvatarPath(customerId, avatarPath);
    });
  }
}
