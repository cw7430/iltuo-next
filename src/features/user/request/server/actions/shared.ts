'use server';

import { cookies } from 'next/headers';

import type { ApiSuccessWithResult } from '@/common/api/shared/schema';
import {
  loginAndRefreshResponseSchemaForServer,
  type LoginAndRefreshResponseDtoForServer,
} from '@/features/user/schema';
import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

export const loginAndRefresh = async (
  res: ApiSuccessWithResult<LoginAndRefreshResponseDtoForServer>,
) => {
  const cookieStore = await cookies();

  const validation = loginAndRefreshResponseSchemaForServer.safeParse(
    res.result,
  );

  if (!validation.success) {
    console.error(validation.error);
    throw new ApiError(
      ResponseCode.CUSTOM_VALIDATION_ERROR.code,
      ResponseCode.CUSTOM_VALIDATION_ERROR.message,
    );
  }

  const result = validation.data;

  const refreshMaxAge = result.isAuto
    ? Math.max(
        0,
        Math.floor((result.refreshTokenExpiresAtMs - Date.now()) / 1000),
      )
    : undefined;

  const isSecure = process.env.NEXT_PUBLIC_APP_ENV !== 'local';

  cookieStore.set({
    name: 'accessToken',
    value: result.accessToken,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
  });

  cookieStore.set({
    name: 'refreshToken',
    value: result.refreshToken,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
    ...(refreshMaxAge !== undefined && { maxAge: refreshMaxAge }),
  });

  const {
    refreshToken: _refreshToken,
    refreshTokenExpiresAtMs: _refreshTokenExpiresAtMs,
    accessToken: _accessToken,
    isAuto: _isAuto,
    ...clientData
  } = result;

  return clientData;
};
