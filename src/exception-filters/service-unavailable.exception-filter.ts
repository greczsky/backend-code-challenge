import { Logger, LOGGER_365 } from 'logger-nestjs';
import { Inject } from '@nestjs/common';
import { ServiceUnavailableException } from '@nestjs/common';
import { Catch } from '@nestjs/common';

import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import type { Response } from 'express';

/**
 * Catches ServiceUnavailableException produced by HealthModule and make them response the whole
 * response object not only the short standard error message
 */
@Catch(ServiceUnavailableException)
export class ServiceUnavailableExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER_365) private logger: Logger) {}

  catch(exception: ServiceUnavailableException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const healthCheckResult = exception.getResponse();
    // Add the HealthCheckResult to the response
    response.status(status).json(healthCheckResult);

    this.logger.error('ServiceUnavailableExceptionFilter.serviceUnavailable', {
      healthCheckResult,
    });
  }
}
