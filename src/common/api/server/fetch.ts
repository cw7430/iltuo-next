import 'server-only';

import {
  fetchResponse,
  resolveUrl,
  resolveContentType,
  resolveCacheOptions,
  resolveAuthOptions,
  resolveBody,
  API_BASE_URL,
  type ServerFetchOptions,
} from '@/common/api/shared/fetch';

const serverFetch = async <T>(
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

export const ServerRequest = {
  apiGet: async <T>(
    input: string,
    params?: Record<string, string | number | boolean | undefined>,
    options?: Omit<ServerFetchOptions, 'contentType'>,
  ): Promise<T> => {
    const query = params
      ? `?${new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)]),
        )}`
      : '';

    return serverFetch<T>(`${input}${query}`, {
      method: 'GET',
      ...options,
    });
  },

  apiPost: async <T, B = unknown>(
    input: string,
    body?: B | FormData,
    options?: ServerFetchOptions,
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
    body?: B | FormData,
    options?: ServerFetchOptions,
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
    body?: B | FormData,
    options?: ServerFetchOptions,
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
    options?: Omit<ServerFetchOptions, 'contentType'>,
  ): Promise<T> => {
    return serverFetch<T>(input, {
      method: 'DELETE',
      ...options,
    });
  },
};
