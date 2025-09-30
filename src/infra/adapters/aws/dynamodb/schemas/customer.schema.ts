import { z } from 'zod';
import { DynamoItemType } from '../enums/dynamo-item-type.enum';

export const CustomerSchema = z.object({
  PK: z.string(),
  SK: z.string(),
  itemType: z.literal(DynamoItemType.Customer),
  id: z.string(),
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  gender: z.string(),
  dateOfBirth: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: '[Zod] - Data de nascimento inválida',
  }),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().nullable(),
  deletedAt: z.iso.datetime().nullable(),
});

export const CustomerEmailLookup = z.object({
  PK: z.string(),
  SK: z.string(),
  itemType: z.literal(DynamoItemType.CustomerEmailLookup),
  id: z.string(),
  email: z.email(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().nullable(),
  deletedAt: z.iso.datetime().nullable(),
});
