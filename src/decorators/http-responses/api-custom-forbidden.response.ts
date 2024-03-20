import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

import { ForbiddenResponse } from '../../models/http-responses/forbidden.response';

export function ApiCustomForbiddenResponse() {
  return applyDecorators(
    ApiForbiddenResponse({
      description: 'Forbidden error response',
      type: ForbiddenResponse,
    }),
  );
}
