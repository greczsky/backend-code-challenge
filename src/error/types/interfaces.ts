import type { ErrorCode } from './enums';

export interface ErrorDetail {
  code: ErrorCode;
  description: string;
}
