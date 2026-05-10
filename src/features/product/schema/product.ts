import { z } from 'zod';

import { zStringToBigInt } from '@/common/lib';
import { categoryResponseSchema } from '@/features/global/schema';

const productResponseSchema = z.object({
  productId: z.string(),
  minerCategoryId: z.string(),
  productName: z.string(),
  productComments: z.string().nullable(),
  fileName: z.string(),
  price: zStringToBigInt,
  discountedRate: zStringToBigInt,
  isRecommended: z.boolean(),
  isValid: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const recommendedProductListResponseSchema = z.array(
  productResponseSchema,
);

export const productListResponseSchema = categoryResponseSchema.extend({
  products: recommendedProductListResponseSchema,
});

export type ProductResponseDto = z.infer<typeof productResponseSchema>;

export type RecommendedProductListResponseDto = z.infer<
  typeof recommendedProductListResponseSchema
>;

export type ProductListResponseDto = z.infer<typeof productListResponseSchema>;
