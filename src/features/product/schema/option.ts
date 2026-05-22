import { zStringToBigInt } from '@/common/lib';
import { z } from 'zod';

const detailOptionResponseSchema = z.object({
  detailOptionId: z.string(),
  optionId: z.string(),
  detailOptionName: z.string(),
  optionValue: zStringToBigInt,
  isValid: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

const optionResponseSchema = z.object({
  optionId: z.string(),
  majorCategoryId: z.string(),
  sortKey: z.string(),
  optionName: z.string(),
  optionType: z.enum(['RATE', 'ABSOLUTE']),
  isValid: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  detailOptions: z.array(detailOptionResponseSchema),
});

export const optionListResponseSchema = z.array(optionResponseSchema);

export type OptionListResponseDto = z.infer<typeof optionListResponseSchema>;
