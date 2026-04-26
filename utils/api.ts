export const fetchAPI = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `/api/backend${path}`;

  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) },
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
