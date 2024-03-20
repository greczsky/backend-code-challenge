import { applyDecorators } from '@nestjs/common';
import { ApiPayloadTooLargeResponse } from '@nestjs/swagger';

import { PayloadTooLargeResponse } from '../../models/http-responses/payload-too-large.response';

export function ApiCustomPayloadTooLargeResponse() {
  return applyDecorators(
    ApiPayloadTooLargeResponse({
      description: 'Payload too large error response',
      type: PayloadTooLargeResponse,
    }),
  );
}
