'use server';

import { ServerRequest } from '@/common/api/server';
import { ResponseCode } from '@/common/api/shared/constants';
import { ApiError } from '@/common/api/shared/error';
import { responseWithResult } from '@/common/api/shared/fetch';
import { type ApiSuccessWithResult } from '@/common/api/shared/schema';
import {
  type RefreshRequestDto,
  type LoginAndRefreshResponseDtoForServer,
} from '@/features/user/schema';
import { loginAndRefresh } from './shared';

const { apiPost } = ServerRequest;

export const refreshAction = async (body: RefreshRequestDto) =>
  responseWithResult(async () => {
    const res = await apiPost<
      ApiSuccessWithResult<LoginAndRefreshResponseDtoForServer>
    >('/user/refresh', { authType: 'refresh' }, body);

    if (!res?.result) {
      throw new ApiError(
        ResponseCode.INTERNAL_SERVER_ERROR.code,
        ResponseCode.INTERNAL_SERVER_ERROR.message,
      );
    }

    return loginAndRefresh(res, body.isAuto);
  });
