import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type {
  UpdateAvatarUseCaseInterface,
  UpdateAvatarOutput,
} from '../../core/app/usecases/update-avatar/update-avatar.interface';
import { UPDATE_AVATAR } from '../config/tokens';

@Controller()
export class AvatarController {
  constructor(
    @Inject(UPDATE_AVATAR)
    private readonly updateAvatarUseCase: UpdateAvatarUseCaseInterface,
  ) {}

  /**
   * Atualiza o avatar de um cliente
   * POST /customers/:id/avatar
   */
  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  public async updateAvatar(
    @Param('id') customerId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }), // 1 MB
          new FileTypeValidator({ fileType: /image\/(png|jpeg|webp)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<UpdateAvatarOutput> {
    if (!file) {
      throw new BadRequestException('Arquivo não enviado.');
    }

    const allowedTypes = /image\/(png|jpeg|webp)/;
    if (!allowedTypes.test(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido: ${file.mimetype}`,
      );
    }

    return this.updateAvatarUseCase.update({
      customerId,
      file: file.buffer,
      contentType: file.mimetype,
    });
  }
}
