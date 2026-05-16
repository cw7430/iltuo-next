import { ServerRequest } from '@/common/api/server';
import { responseWithResult } from '@/common/api/shared/fetch';
import { ApiError } from '@/common/api/shared/error';
import type { ApiSuccessWithResult } from '@/common/api/shared/schema';
import { ResponseCode } from '@/common/api/shared/constants';
import {
  recommendedProductListResponseSchema,
  productListResponseSchema,
  type RecommendedProductListResponseDto,
  type ProductListRequestDto,
  type ProductListResponseDto,
} from '@/features/product/schema';

const { apiGet } = ServerRequest;

export const getRecommendedProducts = async () =>
  responseWithResult(async () => {
    const res = await apiGet<
      ApiSuccessWithResult<RecommendedProductListResponseDto>
    >('/product/recommended', {
      cacheStrategy: { type: 'tags', tags: ['init', 'products'] },
    });

    if (!res?.result) {
      throw new ApiError(
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.code,
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.message,
      );
    }

    const validation = recommendedProductListResponseSchema.safeParse(
      res.result,
    );

    if (!validation.success) {
      console.error(validation.error);
      throw new ApiError(
        ResponseCode.CUSTOM_VALIDATION_ERROR.code,
        ResponseCode.CUSTOM_VALIDATION_ERROR.message,
      );
    }

    return validation.data;
  });

export const getProductList = async (
  majorCategoryId: string,
  param: ProductListRequestDto,
) =>
  responseWithResult(async () => {
    const res = await apiGet<ApiSuccessWithResult<ProductListResponseDto>>(
      `/product/${majorCategoryId}`,
      {},
      param,
    );

    if (!res?.result) {
      throw new ApiError(
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.code,
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.message,
      );
    }

    const validation = productListResponseSchema.safeParse(res.result);

    if (!validation.success) {
      console.error(validation.error);
      throw new ApiError(
        ResponseCode.CUSTOM_VALIDATION_ERROR.code,
        ResponseCode.CUSTOM_VALIDATION_ERROR.message,
      );
    }

    return validation.data;
  });
