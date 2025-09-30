import { z } from 'zod';
import { DynamoItemType } from '../enums/dynamo-item-type.enum';
import { DocumentTypeEnum } from '../../../../../core/domain/enums/document-type.enum';

const documentTypes = [
  DocumentTypeEnum.RG,
  DocumentTypeEnum.CPF,
  DocumentTypeEnum.CNH,
  DocumentTypeEnum.CNPJ,
  DocumentTypeEnum.PASSPORT,
];

export const DocumentSchema = z.object({
  PK: z.string(),
  SK: z.string(),
  itemType: z.literal(DynamoItemType.Document),
  id: z.string(),
  customerId: z.string(),
  type: z.enum(documentTypes),
  value: z.string(),
  issuingAuthority: z.string().nullable(),
  issueDate: z.preprocess(
    (val) => (val ? new Date(<string>val) : null),
    z.date().nullable(),
  ),
  expirationDate: z.preprocess(
    (val) => (val ? new Date(<string>val) : null),
    z.date().nullable(),
  ),
  createdAt: z.preprocess((val) => new Date(<string>val), z.date()),
  updatedAt: z.preprocess(
    (val) => (val ? new Date(<string>val) : null),
    z.date().nullable(),
  ),
  deletedAt: z.preprocess(
    (val) => (val ? new Date(<string>val) : null),
    z.date().nullable(),
  ),
});

export const DocumentValueLookup = z.object({
  PK: z.string(),
  SK: z.string(),
  itemType: z.literal(DynamoItemType.DocumentValueLookup),
  id: z.string(),
  customerId: z.string(),
  type: z.enum(documentTypes),
  value: z.string(),
});

export const CustomerDocumentTypeLookup = z.object({
  PK: z.string(),
  SK: z.string(),
  itemType: z.literal(DynamoItemType.CustomerDocumentTypeLookup),
  id: z.string(),
  customerId: z.string(),
  type: z.enum(documentTypes),
  value: z.string(),
});

export const CustomerDocumentIdLookup = z.object({
  PK: z.string(),
  SK: z.string(),
  itemType: z.literal(DynamoItemType.CustomerDocumentIdLookup),
  id: z.string(),
  customerId: z.string(),
  type: z.enum(documentTypes),
  value: z.string(),
});
