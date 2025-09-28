import { PasswordInterface } from './interfaces/password.interface';
import { PasswordHasherInterface } from '../../../app/ports/password-hasher.interface';
import { DomainPasswordError } from '../../exceptions/domain-password.error';

export class Password implements PasswordInterface {
  private readonly _hash: string;

  constructor(hash: string) {
    this.validateHash(hash);
    this._hash = hash;
  }

  public get hash(): string {
    return this._hash;
  }

  public static async create(
    plain: string,
    hasher: PasswordHasherInterface,
    salt: number = 10,
  ): Promise<Password> {
    if (!plain || plain.trim().length < 8) {
      throw new DomainPasswordError(
        'A senha deve conter pelo menos 8 caracteres.',
      );
    }
    return new Password(await hasher.hash(plain, salt));
  }

  private validateHash(hash?: string): void {
    if (!hash || hash.trim().length === 0) {
      throw new DomainPasswordError('O hash não pode ser vazio.');
    }
    const bcryptRegex = /^\$2[aby]\$\d{2}\$[./0-9A-Za-z]{53}$/;
    if (!bcryptRegex.test(hash)) {
      throw new DomainPasswordError('O formato do hash é inválido.');
    }
  }
}
