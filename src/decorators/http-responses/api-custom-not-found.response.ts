import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

import { NotFoundResponse } from '../../models/http-responses/not-found.response';

export function ApiCustomNotFoundResponse() {
  return applyDecorators(
    ApiNotFoundResponse({
      description: 'Not found error response',
      type: NotFoundResponse,
    }),
  );
}
