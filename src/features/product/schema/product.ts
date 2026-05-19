import { z } from 'zod';

import { zStringToBigInt } from '@/common/lib';
import {
  categoryResponseSchema,
  pageRequestSchema,
  pageResponseSchema,
} from '@/features/global/schema';

export const productListRequestSchema = pageRequestSchema.extend({
  minerCategoryId: z.string(),
  sort: z.enum([
    'recommended',
    'priceAsc',
    'priceDesc',
    'createdAsc',
    'createdDesc',
  ]),
});

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

const pagedProductListResponseSchema = pageResponseSchema.extend({
  content: z.array(productResponseSchema),
});

export const recommendedProductListResponseSchema = z.array(
  productResponseSchema,
);

export const productListResponseSchema = categoryResponseSchema.extend({
  products: pagedProductListResponseSchema,
});

export type ProductListRequestDto = z.infer<typeof productListRequestSchema>;

export type ProductResponseDto = z.infer<typeof productResponseSchema>;

export type RecommendedProductListResponseDto = z.infer<
  typeof recommendedProductListResponseSchema
>;

export type ProductListResponseDto = z.infer<typeof productListResponseSchema>;
