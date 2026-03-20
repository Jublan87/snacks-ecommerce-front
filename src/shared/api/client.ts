import { ApiError } from './api-error';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
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

  return response.json() as Promise<T>;
}

const apiClient = {
  get<T>(path: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'POST', body });
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'PUT', body });
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'PATCH', body });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
};

export { apiClient };
