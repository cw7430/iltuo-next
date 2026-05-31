'use server';

import { ServerRequest } from '@/common/api/server';
import { ResponseCode } from '@/common/api/shared/constants';
import { ApiError } from '@/common/api/shared/error';
import { responseWithResult, responseSingle } from '@/common/api/shared/fetch';
import {
  type ApiSuccessSingle,
  type ApiSuccessWithResult,
} from '@/common/api/shared/schema';
import {
  type CheckUserRequestDto,
  type NativeRegisterRequestDto,
  type LoginAndRefreshResponseDtoForServer,
} from '@/features/user/schema';
import { loginAndRefresh } from './shared';

const { apiPost } = ServerRequest;

export const checkUser = async (body: CheckUserRequestDto) =>
  responseSingle(async () => {
    const res = await apiPost<ApiSuccessSingle>('/user/check-user', {}, body);
    if (!res) {
      throw new ApiError(
        ResponseCode.INTERNAL_SERVER_ERROR.code,
        ResponseCode.INTERNAL_SERVER_ERROR.message,
      );
    }
  });

export const registerAction = async (body: NativeRegisterRequestDto) =>
  responseWithResult(async () => {
    const { confirmPassword, ...req } = body;

    if (req.password !== confirmPassword) {
      throw new ApiError('CVE', '비밀번호가 일치하니 않습니다.');
    }

    const res = await apiPost<
      ApiSuccessWithResult<LoginAndRefreshResponseDtoForServer>
    >('/user/register/native', {}, req);

    if (!res?.result) {
      throw new ApiError(
        ResponseCode.INTERNAL_SERVER_ERROR.code,
        ResponseCode.INTERNAL_SERVER_ERROR.message,
      );
    }

    return loginAndRefresh(res);
  });
