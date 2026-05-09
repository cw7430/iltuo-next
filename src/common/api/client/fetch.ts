import 'client-only';
import {
  fetchResponse,
  resolveUrl,
  resolveContentType,
  resolveBody,
  type ClientFetchOptions,
} from '@/common/api/shared/fetch';

const clientFetch = async <T>(
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

export const ClientRequest = {
  apiGet: async <T>(
    input: string,
    params?: Record<string, string | number | boolean | undefined>,
    options?: Omit<ClientFetchOptions, 'contentType'>,
  ): Promise<T> => {
    const query = params
      ? `?${new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)]),
        )}`
      : '';

    return clientFetch<T>(`${input}${query}`, {
      method: 'GET',
      ...options,
    });
  },

  apiPost: async <T, B = unknown>(
    input: string,
    body?: B | FormData,
    options?: ClientFetchOptions,
  ): Promise<T> => {
    return clientFetch<T>(input, {
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
    options?: ClientFetchOptions,
  ): Promise<T> => {
    return clientFetch<T>(input, {
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
    options?: ClientFetchOptions,
  ): Promise<T> => {
    return clientFetch<T>(input, {
      method: 'PATCH',
      ...options,
      ...(body !== undefined && {
        body: resolveBody(body, options?.contentType),
      }),
    });
  },

  apiDelete: async <T = void>(
    input: string,
    options?: Omit<ClientFetchOptions, 'contentType'>,
  ): Promise<T> => {
    return clientFetch<T>(input, {
      method: 'DELETE',
      ...options,
    });
  },
};
