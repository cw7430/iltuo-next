import { cookies } from 'next/headers';

import { ApiError } from '@/common/api/shared/error';
import { ResponseCode } from '@/common/api/shared/constants';

export type CacheStrategy =
  | { type: 'no-store' }
  | { type: 'force-cache' }
  | { type: 'revalidate'; seconds: number }
  | { type: 'tags'; tags: string[] };

export type AuthType = 'access' | 'refresh' | 'none';

export type ContentType = 'json' | 'form';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export const resolveAuthOptions = async (authType: AuthType) => {
  if (authType === 'none') return null;

  const cookieStore = await cookies();
  const cookieKey = authType === 'access' ? 'accessToken' : 'refreshToken';
  const bearerToken = cookieStore.get(cookieKey)?.value;

  if (!bearerToken) {
    throw new ApiError(
      ResponseCode.UNAUTHORIZED.code,
      ResponseCode.UNAUTHORIZED.message,
    );
  }

  return bearerToken;
};

export const resolveCacheOptions = (
  strategy?: CacheStrategy,
): Pick<RequestInit, 'cache' | 'next'> => {
  if (!strategy) {
    return { cache: 'no-store' };
  }

  switch (strategy.type) {
    case 'no-store':
      return { cache: 'no-store' };

    case 'force-cache':
      return { cache: 'force-cache' };

    case 'revalidate':
      return {
        next: { revalidate: strategy.seconds },
      };

    case 'tags':
      return {
        next: { tags: strategy.tags },
      };
  }
};

export const resolveContentType = (contentType?: ContentType) => {
  return contentType === 'form' ? undefined : 'application/json';
};

export const resolveUrl = (
  type: 'server' | 'client',
  input: string,
  baseUrl?: string,
) => {
  if (!baseUrl) {
    if (type === 'server') return `${API_BASE_URL}${input}`;
    return input;
  }
  const separator = baseUrl.endsWith('/') || input.startsWith('/') ? '' : '/';
  return `${baseUrl}${separator}${input}`;
};

export const fetchResponse = async (res: Response) => {
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(
      data?.code ?? ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.code,
      data?.message ?? ResponseCode.CUSTOM_INTERNAL_SERVER_ERROR.message,
      data?.errors,
    );
  }

  return data;
};

export const resloveQuery = (
  params?: Record<string, string | number | boolean | undefined>,
) => {
  return params
    ? `?${new URLSearchParams(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      )}`
    : '';
};

export const resolveBody = (body?: unknown, contentType?: ContentType) => {
  if (body === undefined || body === null) return undefined;

  if (contentType === 'form' || body instanceof FormData) {
    return body as FormData;
  }

  return JSON.stringify(body);
};
