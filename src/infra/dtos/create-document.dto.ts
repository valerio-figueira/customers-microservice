import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { DocumentTypeEnum } from '../../core/domain/enums/document-type.enum';

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
