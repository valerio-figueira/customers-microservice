import { PasswordHasherInterface } from '../../../core/app/ports/password-hasher.interface';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordHasherAdapter implements PasswordHasherInterface {
  /**
   * Gera um hash seguro para uma senha.
   *
   * @param plain A senha em texto plano.
   * @param salt O 'salt' usado para o hash, representado pelo número de rodadas.
   * @returns O hash da senha.
   */
  public async hash(plain: string, salt: number): Promise<string> {
    const saltString = await bcrypt.genSalt(salt);
    return bcrypt.hash(plain, saltString);
  }

  /**
   * Compara uma senha em texto plano com um hash.
   *
   * @param plain A senha em texto plano a ser comparada.
   * @param hash O hash da senha armazenado.
   * @returns `true` se as senhas coincidirem, `false` caso contrário.
   */
  public async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
