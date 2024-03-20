import { applyDecorators } from '@nestjs/common';
import { ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { UnprocessableEntityResponse } from '../../models/http-responses/unprocessable-entity.response';

export function ApiCustomUnprocessableEntityResponse() {
  return applyDecorators(
    ApiUnprocessableEntityResponse({
      description: 'Unprocessable entity error response',
      type: UnprocessableEntityResponse,
    }),
  );
}
