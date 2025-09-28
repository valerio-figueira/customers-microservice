import { GenderEnum } from '../../enums/gender.enum';
import { DomainGenderError } from '../../exceptions/domain-gender.error';
import { GenderInterface } from './interfaces/gender.interface';
import { GenderType } from '../interfaces/customer.interface';

export class Gender implements GenderInterface {
  private readonly VALID_VALUES: GenderType[] = [
    GenderEnum.MALE,
    GenderEnum.FEMALE,
  ];
  private readonly _value: GenderType;

  constructor(value: GenderType) {
    this._value = this.create(value);
  }

  private create(value: GenderType): GenderType {
    if (!this.VALID_VALUES.includes(value)) {
      throw new DomainGenderError(
        `Gênero inválido: "${value}". Aceitos: ${this.VALID_VALUES.join(', ')}`,
      );
    }
    return value;
  }

  public get value(): GenderType {
    return this._value;
  }

  public equals(other: Gender): boolean {
    return this._value === other._value;
  }
}
