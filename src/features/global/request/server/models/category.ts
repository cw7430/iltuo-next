import { ServerRequest } from '@/common/api/server';
import { responseWithResult } from '@/common/api/shared/fetch';
import { ApiError } from '@/common/api/shared/error';
import type { ApiSuccessWithResult } from '@/common/api/shared/schema';
import { ResponseCode } from '@/common/api/shared/constants';
import {
  categoryListResponseSchema,
  type CategoryListResponseDto,
} from '@/features/global/schema';

const { apiGet } = ServerRequest;

export const getCategories = async () =>
  responseWithResult(async () => {
    const res = await apiGet<ApiSuccessWithResult<CategoryListResponseDto>>(
      '/categories',
      { cacheStrategy: { type: 'tags', tags: ['init', 'categories'] } },
    );

    if (!res?.result) {
      throw new ApiError(
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.code,
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.message,
      );
    }

    const validation = categoryListResponseSchema.safeParse(res.result);

    if (!validation.success) {
      throw new ApiError(
        ResponseCode.CUSTOM_VALIDATION_ERROR.code,
        ResponseCode.CUSTOM_VALIDATION_ERROR.message,
      );
    }

    return validation.data;
  });
