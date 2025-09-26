import { GenderEnum } from '../../core/domain/enums/gender.enum';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDocumentDto } from './create-document.dto';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 2,
    minLowercase: 4,
    minSymbols: 0,
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(GenderEnum)
  @IsNotEmpty()
  gender: GenderEnum;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: Date;

  @ValidateNested({ each: true, always: true })
  @Type(() => CreateDocumentDto)
  documents: CreateDocumentDto[];
}
