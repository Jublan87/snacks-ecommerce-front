import { ApiError } from './api-error';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
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

  // Unwrap NestJS envelope: { success, data, timestamp } → data
  const json = await response.json();
  return (json?.data !== undefined ? json.data : json) as T;
}

const clientBff = {
  get<T>(path: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return request<T>(`/api/client${path}`, { ...options, method: 'GET' });
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(`/api/client${path}`, { ...options, method: 'POST', body });
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(`/api/client${path}`, { ...options, method: 'PUT', body });
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(`/api/client${path}`, { ...options, method: 'PATCH', body });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(`/api/client${path}`, { ...options, method: 'DELETE' });
  },
};

export { clientBff as clientFetch };
