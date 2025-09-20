import { customAlphabet } from 'nanoid';
import { IdGeneratorInterface } from '../../core/app/ports/id-generator.interface';

/*
 * Detalhe de infra, não deve ser importado no core em hipótese alguma
 * */
export class IdGenerator implements IdGeneratorInterface {
  private readonly generateId: (size?: number) => string;
  private readonly ALPHABET: string = '0123456789abcdefghijklmnopqrstuvwxyz';
  private readonly ID_LENGTH: number = 24;

  constructor() {
    this.generateId = customAlphabet<string>(this.ALPHABET, this.ID_LENGTH);
  }

  public generate(prefix: string): string {
    if (!prefix || prefix.trim() === '') {
      throw new Error('Prefix cannot be empty.');
    }
    const uniqueId = this.generateId(this.ID_LENGTH);
    return `${prefix}_${uniqueId}`;
  }
}
