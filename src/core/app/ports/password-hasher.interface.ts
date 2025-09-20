export interface PasswordHasherInterface {
  hash(plain: string, salt: number): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
