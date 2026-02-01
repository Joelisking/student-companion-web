const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const fetchAPI = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { headers, ...rest } = options;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: defaultHeaders,
    ...rest,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API Error: ${response.statusText}`
    );
  }

  return response.json();
};
