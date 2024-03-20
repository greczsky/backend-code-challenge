import { applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

import { UnauthorizedResponse } from '../../models/http-responses/unauthorized.response';

export function ApiCustomUnauthorizedResponse() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Unauthorized error response',
      type: UnauthorizedResponse,
    }),
  );
}
