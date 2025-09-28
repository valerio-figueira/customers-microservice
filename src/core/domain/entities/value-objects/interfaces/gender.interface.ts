import { GenderEnum } from '../../../enums/gender.enum';
import { GenderType } from '../../interfaces/customer.interface';

export interface GenderInterface {
  value: GenderEnum | GenderType;
  equals: (other: GenderInterface) => boolean;
}
