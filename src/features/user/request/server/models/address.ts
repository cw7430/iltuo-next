import type { ApiSuccessWithResult } from '@/common/api/shared/schema';
import {
  addressListResponseSchema,
  type AddressListResponseDto,
} from '@/features/user/schema';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';
import { responseWithResult } from '@/common/api/shared/fetch';
import { ServerRequest } from '@/common/api/server';

const { apiGet } = ServerRequest;

export const getAddressList = async () =>
  responseWithResult(async () => {
    const res = await apiGet<ApiSuccessWithResult<AddressListResponseDto>>(
      '/user/address',
      {
        authType: 'access',
      },
    );

    if (!res?.result) {
      throw new ApiError(
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.code,
        ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.message,
      );
    }

    const validation = addressListResponseSchema.safeParse(res.result);

    if (!validation.success) {
      console.error(validation.error);
      throw new ApiError(
        ResponseCode.CUSTOM_VALIDATION_ERROR.code,
        ResponseCode.CUSTOM_VALIDATION_ERROR.message,
      );
    }

    return validation.data;
  });
