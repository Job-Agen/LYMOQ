import type { ApiErrorDto } from '@mesura/shared';

export const DEFAULT_API_URL = normalizeUrl(process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000');
let API_URL = DEFAULT_API_URL;

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

/** Sandbox only: lets an installed APK target any reachable API without rebuilding. */
export function setApiBaseUrl(url: string | null): void {
  API_URL = url ? normalizeUrl(url) : DEFAULT_API_URL;
}

export function getApiBaseUrl(): string {
  return API_URL;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly issues: ApiErrorDto['issues'] = [],
  ) {
    super(message);
  }
}

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, `Can't reach Mesura right now. Check your connection (API: ${API_URL}).`);
  }

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = (data ?? {}) as Partial<ApiErrorDto>;
    if (response.status === 401 && accessToken) onUnauthorized?.();
    const message =
      typeof error.message === 'string'
        ? error.message
        : response.status === 429
          ? 'Too many attempts. Wait a minute and try again.'
          : 'Something went wrong. Please try again.';
    throw new ApiError(response.status, message, error.issues);
  }
  return data as T;
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'Something went wrong. Please try again.';
}
