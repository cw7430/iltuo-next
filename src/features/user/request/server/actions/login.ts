'use server';

import { ServerRequest } from '@/common/api/server';
import { ResponseCode } from '@/common/api/shared/constants';
import { ApiError } from '@/common/api/shared/error';
import { responseWithResult } from '@/common/api/shared/fetch';
import { type ApiSuccessWithResult } from '@/common/api/shared/schema';
import {
  type LoginRequestDto,
  type LoginAndRefreshResponseDtoForServer,
} from '@/features/user/schema';
import { loginAndRefresh } from './shared';

const { apiPost } = ServerRequest;

export const loginAction = async (body: LoginRequestDto) =>
  responseWithResult(async () => {
    const res = await apiPost<
      ApiSuccessWithResult<LoginAndRefreshResponseDtoForServer>
    >('/user/login/native', {}, body);

    if (!res?.result) {
      throw new ApiError(
        ResponseCode.INTERNAL_SERVER_ERROR.code,
        ResponseCode.INTERNAL_SERVER_ERROR.message,
      );
    }

    return loginAndRefresh(res, body.isAuto);
  });
