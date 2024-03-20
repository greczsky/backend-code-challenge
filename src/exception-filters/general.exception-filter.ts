import { InternalServerErrorException, HttpServer } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { toLogFriendlyError } from 'src/helpers/error/error.helper';
import { errorResponseNestjs } from 'src/models/http-responses/http.response';
import { HttpStatusCodeToMessage } from 'src/types/constants';
import { HttpStatusCode } from 'src/types/enums';

import type { ArgumentsHost } from '@nestjs/common';
import type { Response, Request } from 'express';

/**
 * Log error message and fill response with internal server error
 */
const sendInternalServerError = ({
  response,
  logger,
  exception,
  correlationId,
  context,
}: {
  response: Response;
  logger: Logger;
  exception: unknown;
  correlationId: string;
  context: string;
}) => {
  logger.error('commons-nestjs.GeneralExceptionFilter.sendInternalServerError.error', {
    ...toLogFriendlyError(exception),
    context,
    correlationId,
  });

  response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
    errorResponseNestjs({
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: `Correlation ID: ${correlationId}`,
    }),
  );
};

@Catch()
export class GeneralExceptionFilter extends BaseExceptionFilter {
  constructor(applicationRef: HttpServer, private logger: Logger) {
    super(applicationRef);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const correlationId = request.header('x-correlation-id') || 'unknown';
    const context = GeneralExceptionFilter.name;
    const logger = this.logger;

    if (
      !(exception instanceof HttpException) ||
      exception instanceof InternalServerErrorException
    ) {
      return sendInternalServerError({ response, logger, exception, correlationId, context });
    }

    const statusCode = exception.getStatus();
    if (!(statusCode in HttpStatusCodeToMessage)) {
      return sendInternalServerError({ response, logger, exception, correlationId, context });
    }

    const { message, errorCodes } = exception.getResponse() as {
      statusCode: number;
      message: string | string[];
      errorCodes?: string[];
    };

    const responseData = errorResponseNestjs({ statusCode, message, errorCodes });
    this.logger.warn('commons-nestjs.GeneralExceptionFilter.appError', {
      source: exception.name,
      context,
      correlationId: request.header('x-correlation-id'),
      responseData,
    });
    return response.status(statusCode).json(responseData);
  }
}
