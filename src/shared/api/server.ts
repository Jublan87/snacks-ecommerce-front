import { cookies } from 'next/headers';
import { ApiError } from './api-error';

const BASE_URL = process.env.API_URL;

type NextFetchOptions = {
  next?: { revalidate?: number; tags?: string[] };
  cache?: RequestCache;
};

type RequestOptions = Omit<RequestInit, 'body'> &
  NextFetchOptions & {
    body?: unknown;
  };

async function serverFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, next, cache, ...rest } = options;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    ...(next ? { next } : {}),
    ...(cache ? { cache } : {}),
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = response.statusText;
    let errors: Record<string, string[]> | undefined;

    try {
      const data = await response.json();
      message = data.message ?? message;
      errors = data.errors;
    } catch {
      // non-JSON error body — keep statusText
    }

    throw new ApiError(response.status, message, errors);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function serverGet<T>(
  path: string,
  options?: Omit<RequestOptions, 'body'> & NextFetchOptions,
): Promise<T> {
  return serverFetch<T>(path, { ...options, method: 'GET' });
}

function serverPost<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return serverFetch<T>(path, { ...options, method: 'POST', body, cache: 'no-store' });
}

function serverPut<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return serverFetch<T>(path, { ...options, method: 'PUT', body, cache: 'no-store' });
}

function serverPatch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
  return serverFetch<T>(path, { ...options, method: 'PATCH', body, cache: 'no-store' });
}

function serverDelete<T>(path: string, options?: RequestOptions): Promise<T> {
  return serverFetch<T>(path, { ...options, method: 'DELETE', cache: 'no-store' });
}

export { serverFetch, serverGet, serverPost, serverPut, serverPatch, serverDelete };
