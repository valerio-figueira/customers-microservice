import { IdGeneratorInterface } from '../../../core/app/ports/id-generator.interface';
import { ulid } from 'ulid';

export class UlidGeneratorAdapter implements IdGeneratorInterface {
  constructor() {}

  public generate(prefix: string): string {
    if (!prefix || prefix.trim() === '') {
      throw new Error('Prefix cannot be empty.');
    }

    const uniqueId = ulid();
    return `${prefix}_${uniqueId}`;
  }
}
