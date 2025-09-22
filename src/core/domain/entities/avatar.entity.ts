import { ApplicationValidationError } from '../../app/commons/errors/errors';
import { AvatarInterface } from './interfaces/avatar.interface';

export class Avatar implements AvatarInterface {
  private readonly _path: string | null;
  private readonly _url: string | null;
  private readonly _thumbnailUrl: string | null;
  private readonly _uploadedAt: Date | null;

  constructor(props?: AvatarInterface) {
    const {
      path = null,
      url = null,
      thumbnailUrl = null,
      uploadedAt = null,
    } = props || {};

    if (path && !Avatar.isValidPath(path)) {
      throw new ApplicationValidationError('O caminho do avatar é inválido.');
    }

    this._path = path;
    this._url = url;
    this._thumbnailUrl = thumbnailUrl;
    this._uploadedAt = uploadedAt;
  }

  public get path(): string | null {
    return this._path;
  }

  public get url(): string | null {
    return this._url;
  }

  public get thumbnailUrl(): string | null {
    return this._thumbnailUrl;
  }

  public get uploadedAt(): Date | null {
    return this._uploadedAt;
  }

  public hasAvatar(): boolean {
    return this._path !== null && this._path.trim() !== '';
  }

  public equals(other: Avatar): boolean {
    return this._path === other.path;
  }

  public getPathOrThrow(): string {
    if (!this._path) {
      throw new ApplicationValidationError(
        'O caminho do avatar é obrigatório.',
      );
    }
    return this._path;
  }

  private static isValidPath(path: string): boolean {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const ext = path.split('.').pop()?.toLowerCase();
    return Boolean(ext && allowedExtensions.includes(ext));
  }
}
