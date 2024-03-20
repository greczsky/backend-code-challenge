import { applyDecorators } from '@nestjs/common';
import { ApiConflictResponse } from '@nestjs/swagger';

import { ConflictResponse } from '../../models/http-responses/conflict.response';

export function ApiCustomConflictResponse() {
  return applyDecorators(
    ApiConflictResponse({
      description: 'Conflict error response',
      type: ConflictResponse,
    }),
  );
}
