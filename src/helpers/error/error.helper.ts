import { inspect } from 'util';

import { isAxiosError, isObject, hasStack, hasMessage, hasName } from './type.helper';

import type { LogFriendlyError } from 'src/types/types';

/**
 * Transforms error to safe error that is suitable to be logged by @libs-365/logger
 */
export function toLogFriendlyError(error: unknown): LogFriendlyError {
  const logFriendlyError: LogFriendlyError = {
    stack: new Error().stack ?? 'Unknown stack',
    error: {
      name: 'Unknown error',
      message: 'Unknown error',
    },
  };

  if (!error) {
    return logFriendlyError;
  }

  if (!isObject(error)) {
    logFriendlyError.error.detail = error;
    return logFriendlyError;
  }

  if (hasName(error)) {
    logFriendlyError.error.name = error.name;
  }

  if (hasMessage(error)) {
    logFriendlyError.error.message = error.message;
  }

  if (hasStack(error)) {
    logFriendlyError.stack = error.stack;
  }

  if (isAxiosError(error)) {
    logFriendlyError.error.detail = {
      isAxiosError: true,
      url: error.config?.url,
      method: error.config?.method,
      status: error.status,
      response: error.response?.data,
    };
  } else {
    logFriendlyError.error.detail = inspect(error);
  }

  return logFriendlyError;
}
