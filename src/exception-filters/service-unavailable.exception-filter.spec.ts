import { ServiceUnavailableException } from '@nestjs/common';
import { createMock } from 'ts-auto-mock';

import { ServiceUnavailableExceptionFilter } from './service-unavailable.exception-filter';

import type { Logger } from 'logger-nestjs';
import type { HealthCheckResult } from '@nestjs/terminus';

describe('ServiceUnavailableExceptionFilter tests', () => {
  let filter: ServiceUnavailableExceptionFilter;

  const mockJson = jest.fn();

  const mockStatus = jest.fn().mockImplementation(() => ({
    json: mockJson,
  }));

  const mockGetResponse = jest.fn().mockImplementation(() => ({
    status: mockStatus,
  }));

  const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
    getRequest: jest.fn(),
  }));

  const mockArgumentHost = {
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToHttp: mockHttpArgumentsHost,
    switchToWs: jest.fn(),
    getType: jest.fn(),
  };

  let loggerMock: Logger;

  beforeEach(() => {
    loggerMock = createMock<Logger>();

    filter = new ServiceUnavailableExceptionFilter(loggerMock);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should set the whole exception object to the response', () => {
    const errObject: HealthCheckResult = {
      status: 'ok',
      info: {
        'basic-app-check': {
          status: 'up',
          comment: 'A basic application check',
        },
        db: { status: 'up' },
      },
      error: {},
      details: {
        'basic-app-check': {
          status: 'up',
          comment: 'A basic application check',
        },
        db: { status: 'up' },
      },
    };

    filter.catch(new ServiceUnavailableException(errObject), mockArgumentHost);

    expect(mockStatus).toHaveBeenCalledWith(503);
    expect(mockJson).toHaveBeenCalledWith({
      status: 'ok',
      info: {
        'basic-app-check': {
          status: 'up',
          comment: 'A basic application check',
        },
        db: { status: 'up' },
      },
      error: {},
      details: {
        'basic-app-check': {
          status: 'up',
          comment: 'A basic application check',
        },
        db: { status: 'up' },
      },
    });
  });
});
