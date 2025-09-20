import { GenderEnum } from '../../core/domain/enums/gender.enum';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { DocumentTypeEnum } from '../../core/domain/enums/document-type.enum';
import { Type } from 'class-transformer';

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

export class CreateDocumentDto {
  @IsEnum(DocumentTypeEnum)
  type: DocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  value: string;

  @IsString()
  @IsOptional()
  issuingAuthority: string | null = null;

  @IsDateString()
  @IsOptional()
  issueDate: Date | null = null;

  @IsDateString()
  @IsOptional()
  expirationDate: Date | null = null;
}
