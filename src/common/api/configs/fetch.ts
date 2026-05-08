import { cookies } from 'next/headers';

import { ApiError } from './api-error';
import { ResponseCode } from '@/common/api/constants';

type CacheStrategy =
  | { type: 'no-store' }
  | { type: 'force-cache' }
  | { type: 'revalidate'; seconds: number }
  | { type: 'tags'; tags: string[] };

type AuthType = 'access' | 'refresh' | 'none';

type ContentType = 'json' | 'form';

export interface ServerFetchOptions extends RequestInit {
  next?: NextFetchRequestConfig;
  baseUrl?: string;
  authType?: AuthType;
  cacheStrategy?: CacheStrategy;
  contentType?: ContentType;
}

export interface ClientFetchOptions extends RequestInit {
  contentType?: ContentType;
  baseUrl?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

const resolveAuthOptions = async (authType: AuthType) => {
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

const resolveCacheOptions = (
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

const resolveContentType = (contentType?: ContentType) => {
  return contentType === 'form' ? undefined : 'application/json';
};

const resolveUrl = (
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

const fetchResponse = async (res: Response) => {
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

export const serverFetch = async <T>(
  input: string,
  options: ServerFetchOptions = {},
): Promise<T> => {
  const {
    authType = 'none',
    cacheStrategy,
    contentType = 'json',
    baseUrl = API_BASE_URL,
    ...init
  } = options;

  const bearerToken = await resolveAuthOptions(authType);
  const cacheOptions = resolveCacheOptions(cacheStrategy);
  const contentOptions = resolveContentType(contentType);
  const urlOptions = resolveUrl('server', input, baseUrl);

  const res = await fetch(urlOptions, {
    ...init,
    ...cacheOptions,
    headers: {
      ...(contentOptions && { 'Content-Type': contentOptions }),
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
      ...init?.headers,
    },
  });

  return fetchResponse(res);
};

export const clientFetch = async <T>(
  input: string,
  options: ClientFetchOptions = {},
): Promise<T> => {
  const { contentType = 'json', baseUrl, ...init } = options;

  const contentOptions = resolveContentType(contentType);
  const urlOptions = resolveUrl('client', input, baseUrl);

  const res = await fetch(urlOptions, {
    ...init,
    credentials: 'include',
    headers: {
      ...(contentOptions && { 'Content-Type': contentOptions }),
      ...init?.headers,
    },
  });

  return fetchResponse(res);
};

export const resolveBody = (body?: unknown, contentType?: ContentType) => {
  if (body === undefined || body === null) return undefined;

  if (contentType === 'form' || body instanceof FormData) {
    return body as FormData;
  }

  return JSON.stringify(body);
};
