import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

import { BadRequestResponse } from '../../models/http-responses/bad-request.response';

export function ApiCustomBadRequestResponse() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Bad request error response',
      type: BadRequestResponse,
    }),
  );
}
