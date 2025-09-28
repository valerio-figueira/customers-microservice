import { GenderEnum } from '../../../enums/gender.enum';

export interface GenderInterface {
  value: GenderEnum;
  equals: (other: GenderInterface) => boolean;
}
