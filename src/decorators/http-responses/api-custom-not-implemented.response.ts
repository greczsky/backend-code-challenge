import { applyDecorators } from '@nestjs/common';
import { ApiNotImplementedResponse } from '@nestjs/swagger';

import { NotImplementedResponse } from '../../models/http-responses/not-implemented.response';

export function ApiCustomNotImplementedResponse() {
  return applyDecorators(
    ApiNotImplementedResponse({
      description: 'Not implemented error response',
      type: NotImplementedResponse,
    }),
  );
}
