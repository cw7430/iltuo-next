'use server';

import { ServerRequest } from '@/common/api/server';
import { ResponseCode } from '@/common/api/shared/constants';
import { ApiError } from '@/common/api/shared/error';
import { responseSingle } from '@/common/api/shared/fetch';
import { type AddressRequestDto } from '@/features/user/schema';
import type { ApiSuccessSingle } from '@/common/api/shared/schema';

const { apiPost, apiPatch } = ServerRequest;

const throwIfEmpty = (res: unknown) => {
  if (!res) {
    throw new ApiError(
      ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.code,
      ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.message,
    );
  }
};

const addressAction = async (
  action: () => Promise<ApiSuccessSingle | null | undefined>,
) =>
  responseSingle(async () => {
    const res = await action();
    throwIfEmpty(res);
  });

export const createAddress = async (body: AddressRequestDto) =>
  addressAction(() =>
    apiPost<ApiSuccessSingle>('/user/address', { authType: 'access' }, body),
  );

export const updateAddress = async (
  body: AddressRequestDto,
  addressId: string,
) =>
  addressAction(() =>
    apiPatch<ApiSuccessSingle>(
      `/user/address/${addressId}`,
      { authType: 'access' },
      body,
    ),
  );

export const updateMainAddress = async (addressId: string) =>
  addressAction(() =>
    apiPatch<ApiSuccessSingle>(`/user/address/main/${addressId}`, {
      authType: 'access',
    }),
  );

export const invalidateAddress = async (addressId: string) =>
  addressAction(() =>
    apiPatch<ApiSuccessSingle>(`/user/address/invalidate/${addressId}`, {
      authType: 'access',
    }),
  );
