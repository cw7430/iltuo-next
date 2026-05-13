'use server';

import { cookies } from 'next/headers';

import { ServerRequest } from '@/common/api/server';
import { type ApiSuccessSingle } from '@/common/api/shared/schema';
import { type LogoutRequestDto } from '@/features/user/schema';

const { apiPost } = ServerRequest;

export const logoutAction = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken')?.value || null;

  const body: LogoutRequestDto = { refreshToken };

  try {
    await apiPost<ApiSuccessSingle>('/user/logout', {}, body);
  } catch (error) {
    console.error('Sign-out API call failed:', error);
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
};
