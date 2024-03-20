import type { AxiosError } from 'axios';

export function isObject(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null;
}

export function hasName<T extends Record<string, unknown>>(
  input: T,
): input is T & { name: string } {
  return 'name' in input && typeof input.name === 'string';
}

export function hasMessage<T extends Record<string, unknown>>(
  errorObj: T,
): errorObj is T & { message: string } {
  return 'message' in errorObj && typeof errorObj.message === 'string';
}

export function hasStack<T extends Record<string, unknown>>(
  input: T,
): input is T & { stack: string } {
  return 'stack' in input && typeof input.stack === 'string';
}

/**
 * Custom isAxiosError implementation so we don't need axios as a dependency
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return isObject(error) && error.isAxiosError === true;
}
