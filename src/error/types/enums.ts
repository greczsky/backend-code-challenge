import type { ErrorDetail } from './interfaces';

export enum ErrorCode {
  exampleNotFound = 'EXAMPLE_NOT_FOUND',
}

export const ERROR_DETAILS: ErrorDetail[] = [
  { code: ErrorCode.exampleNotFound, description: 'Example does not exists' },
];
