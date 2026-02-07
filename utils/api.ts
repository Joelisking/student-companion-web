const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const getAuthUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userId');
  }
  return process.env.NEXT_PUBLIC_DEV_USER_ID ?? null;
};

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const fetchAPI = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { headers, ...rest } = options;
  const userId = getAuthUserId();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (userId) {
    defaultHeaders['X-User-Id'] = userId;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: defaultHeaders,
    ...rest,
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
