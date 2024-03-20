import { applyDecorators } from '@nestjs/common';
import { ApiUnsupportedMediaTypeResponse } from '@nestjs/swagger';

import { UnsupportedMediaTypeResponse } from '../../models/http-responses/unsupported-media-type.response';

export function ApiCustomUnsupportedMediaTypeResponse() {
  return applyDecorators(
    ApiUnsupportedMediaTypeResponse({
      description: 'Unsupported media type error response',
      type: UnsupportedMediaTypeResponse,
    }),
  );
}
