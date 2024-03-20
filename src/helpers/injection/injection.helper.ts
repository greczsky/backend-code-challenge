import type { Type } from '@nestjs/common';

/**
 * Helper for creating custom provider
 * Useful when injecting our adapters
 * @param target Target class
 * @returns
 */
export function makeInjectable<T>(target: Type<T>) {
  return {
    provide: target,
    useClass: target,
  };
}
