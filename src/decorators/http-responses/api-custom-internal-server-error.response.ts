import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

import { InternalServerErrorResponse } from '../../models/http-responses/internal-server-error.response';

export function ApiCustomInternalServerErrorResponse() {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: 'Internal server error response',
      type: InternalServerErrorResponse,
    }),
  );
}
