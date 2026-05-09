import { z } from 'zod';

const minerCategoryResponseSchema = z.object({
  minerCategoryId: z.string(),
  majorCategoryId: z.string(),
  sortKey: z.string(),
  minerCategoryName: z.string(),
  isValid: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

const majorCategoryResponseSchema = z.object({
  majorCategoryId: z.string(),
  sortKey: z.string(),
  majorCategoryName: z.string(),
  isValid: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const categoryResponseSchema = majorCategoryResponseSchema.extend({
  minerCategories: z.array(minerCategoryResponseSchema),
});

export const categoryListResponseSchema = z.array(categoryResponseSchema);

export type CategoryResponseDto = z.infer<typeof categoryResponseSchema>;

export type CategoryListResponseDto = z.infer<
  typeof categoryListResponseSchema
>;
