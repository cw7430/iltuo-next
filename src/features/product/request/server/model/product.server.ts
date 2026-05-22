import { ServerRequest } from '@/common/api/server';
import { responseWithResult } from '@/common/api/shared/fetch';
import { ApiError } from '@/common/api/shared/error';
import type {
  ApiSuccessWithResult,
  ResponseWithResult,
} from '@/common/api/shared/schema';
import { ResponseCode } from '@/common/api/shared/constants';
import {
  productResponseSchema,
  recommendedProductListResponseSchema,
  productListResponseSchema,
  productDetailResponseSchema,
  type RecommendedProductListResponseDto,
  type ProductListRequestDto,
  type ProductListResponseDto,
  type ProductDetailResponseDto,
  ProductResponseDto,
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

export const getDetailProduct = async (
  productId: string,
): Promise<ResponseWithResult<ProductDetailResponseDto | ProductResponseDto>> =>
  responseWithResult(async () => {
    const res = await apiGet<ApiSuccessWithResult<ProductDetailResponseDto>>(
      `/product/detail/${productId}`,
    );

    if (!res?.result) {
      throw new ApiError(
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.code,
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.message,
      );
    }

    const { options, ...product } = res.result;

    if (options.length > 0) {
      const validation = productDetailResponseSchema.safeParse(res.result);

      if (!validation.success) {
        console.error(validation.error);
        throw new ApiError(
          ResponseCode.CUSTOM_VALIDATION_ERROR.code,
          ResponseCode.CUSTOM_VALIDATION_ERROR.message,
        );
      }

      return validation.data;
    }

    const validation = productResponseSchema.safeParse(product);

    if (!validation.success) {
      console.error(validation.error);
      throw new ApiError(
        ResponseCode.CUSTOM_VALIDATION_ERROR.code,
        ResponseCode.CUSTOM_VALIDATION_ERROR.message,
      );
    }

    return validation.data;
  });
