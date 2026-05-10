import 'server-only';

import {
  fetchResponse,
  resolveUrl,
  resolveContentType,
  resolveCacheOptions,
  resolveAuthOptions,
  resloveQuery,
  resolveBody,
  API_BASE_URL,
  type AuthType,
  type CacheStrategy,
  type ContentType,
} from '@/common/api/shared/fetch';

interface FetchOptions extends RequestInit {
  next?: NextFetchRequestConfig;
  baseUrl?: string;
  authType?: AuthType;
  cacheStrategy?: CacheStrategy;
  contentType?: ContentType;
}

const serverFetch = async <T>(
  input: string,
  options: FetchOptions = {},
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

export const ServerRequest = {
  apiGet: async <T>(
    input: string,
    options?: Omit<FetchOptions, 'contentType'>,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> => {
    const query = resloveQuery(params);

    return serverFetch<T>(`${input}${query}`, {
      method: 'GET',
      ...options,
    });
  },

  apiPost: async <T, B = unknown>(
    input: string,
    options?: FetchOptions,
    body?: B | FormData,
  ): Promise<T> => {
    return serverFetch<T>(input, {
      method: 'POST',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiPut: async <T, B = unknown>(
    input: string,
    options?: FetchOptions,
    body?: B | FormData,
  ): Promise<T> => {
    return serverFetch<T>(input, {
      method: 'PUT',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiPatch: async <T, B = unknown>(
    input: string,
    options?: FetchOptions,
    body?: B | FormData,
  ): Promise<T> => {
    return serverFetch<T>(input, {
      method: 'PATCH',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiDelete: async <T = void>(
    input: string,
    options?: Omit<FetchOptions, 'contentType'>,
  ): Promise<T> => {
    return serverFetch<T>(input, {
      method: 'DELETE',
      ...options,
    });
  },
};
