const API_BASE =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || '')
    : process.env.NEXT_PUBLIC_API_URL || '';
const API_URL =
  API_BASE || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
const USE_PROXY = !process.env.NEXT_PUBLIC_API_URL;
const PREFIX = USE_PROXY ? '/api/backend' : '';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const fetchAPI = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { headers, ...rest } = options;
  const url = `${API_URL}${PREFIX}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const response = await fetch(url, {
    headers: defaultHeaders,
    ...rest,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      (errorData as { message?: string }).message ??
      (errorData as { error?: string }).error ??
      `API Error: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};
