import { GenderEnum } from '../enums/gender.enum';

export class Gender {
  private readonly VALID_VALUES = [GenderEnum.MALE, GenderEnum.FEMALE];
  private readonly _value: GenderEnum;

  constructor(value: GenderEnum) {
    this._value = this.create(value);
  }

  private create(value: GenderEnum): GenderEnum {
    if (!this.VALID_VALUES.includes(value)) {
      throw new Error(
        `Gênero inválido: "${value}". Aceitos: ${this.VALID_VALUES.join(', ')}`,
      );
    }
    return value;
  }

  public get value(): GenderEnum {
    return this._value;
  }

  public equals(other: Gender): boolean {
    return this._value === other._value;
  }
}
