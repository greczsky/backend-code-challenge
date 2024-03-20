import { CustomBadRequestException } from 'src/exceptions/custom-bad-request.exception';

import type { ValidationError } from '@nestjs/common';
import type { ErrorCode } from 'src/error/types/enums';

function getErrorMessages(validationError: ValidationError, prefix?: string) {
  const messages: string[] = [];

  if (validationError.constraints) {
    const topLevelMessages = Object.values(validationError.constraints);
    messages.push(...topLevelMessages);
  }

  if (validationError.children) {
    const childrenMessages = validationError.children.flatMap((child) =>
      getErrorMessages(child, validationError.property),
    );

    messages.push(...childrenMessages);
  }

  let formattedMessages = messages;
  if (prefix) {
    formattedMessages = messages.map((message) => `${prefix}.${message}`);
  }

  return formattedMessages;
}

function getErrorCodesFromContexts(contexts?: Record<string, unknown>): ErrorCode[] {
  if (!contexts) {
    return [];
  }

  return Object.values(contexts)
    .filter(
      (context: unknown): context is { [key: string]: unknown; errorCode: ErrorCode } =>
        typeof context === 'object' && context !== null && 'errorCode' in context,
    )
    .map((val: { [key: string]: unknown; errorCode: ErrorCode }) => val.errorCode);
}

function getErrorCodes(validationError: ValidationError): ErrorCode[] {
  const errorCodes: ErrorCode[] = getErrorCodesFromContexts(validationError.contexts);

  if (validationError.children) {
    const childrenErrorCodes = validationError.children?.flatMap((child) => getErrorCodes(child));
    errorCodes.push(...childrenErrorCodes);
  }

  return errorCodes;
}

export function transformValidationErrors(validationErrors: ValidationError[]) {
  const messages = validationErrors.flatMap((error) => getErrorMessages(error));
  const errorCodes = validationErrors.flatMap((error) => getErrorCodes(error));

  return new CustomBadRequestException({
    message: messages,
    errorCodes,
  });
}
