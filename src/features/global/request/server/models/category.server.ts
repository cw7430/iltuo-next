import {
  ApiError,
  ServerRequest,
  responseWithResult,
} from '@/common/api/configs';
import type { ApiSuccessWithResult } from '@/common/api/schema';
import { ResponseCode } from '@/common/api/constants';
import {
  categoryResponseSchema,
  type CategoryListResponseDto,
} from '@/features/global/schema';

const { apiGet } = ServerRequest;

export const getCategories = async () =>
  responseWithResult(async () => {
    const res =
      await apiGet<ApiSuccessWithResult<CategoryListResponseDto>>(
        '/categories',
      );

    if (!res?.result) {
      throw new ApiError(
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.code,
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.message,
      );
    }

    const validation = categoryResponseSchema.safeParse(res.result);

    if (!validation.success) {
      throw new ApiError(
        ResponseCode.CUSTOM_VALIDATION_ERROR.code,
        ResponseCode.CUSTOM_VALIDATION_ERROR.message,
      );
    }

    return validation.data;
  });
