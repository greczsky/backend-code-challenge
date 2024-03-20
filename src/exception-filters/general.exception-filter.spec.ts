import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { Logger } from 'nestjs-pino';

import { GeneralExceptionFilter } from './general.exception-filter';

import { CustomBadRequestException } from '../exceptions/custom-bad-request.exception';

const mockJson = jest.fn();

const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));

const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));

const mockGetRequest = jest.fn().mockImplementation(() => ({
  header: (name: string) => {
    const headers: Record<string, string> = {
      'x-correlation-id': '275193e6-93f0-4a3a-834b-d9e2afd73056',
    };

    return headers[name];
  },
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

const mockWarnLog = jest.fn();
const mockErrorLog = jest.fn();

describe('GeneralExceptionFilter', () => {
  let exceptionFilter: GeneralExceptionFilter;

  beforeEach(async () => {
    const LoggerProvider = {
      provide: Logger,
      useValue: {
        warn: mockWarnLog,
        error: mockErrorLog,
      },
    };

    const module = await Test.createTestingModule({
      providers: [LoggerProvider],
    }).compile();

    const app = module.createNestApplication();
    const httpAdapterHost = app.get(HttpAdapterHost);
    const logger = await app.resolve<Logger>(Logger);

    exceptionFilter = new GeneralExceptionFilter(httpAdapterHost.httpAdapter, logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should transform error response when known http error is thrown', () => {
    const exception = new CustomBadRequestException({
      message: 'Invalid params',
      errorCodes: ['INVALID_EMAIL'],
    });

    exceptionFilter.catch(exception, mockArgumentsHost);
    expect(mockWarnLog).toBeCalled();
    expect(mockStatus).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith({
      error: 'Bad Request',
      errorCodes: ['INVALID_EMAIL'],
      message: 'Invalid params',
      messages: ['Invalid params'],
      statusCode: 400,
    });
  });

  it('should return internal server error when non-error object is thrown', () => {
    exceptionFilter.catch('error', mockArgumentsHost);
    expect(mockErrorLog).toBeCalled();
    expect(mockStatus).toBeCalledWith(500);
    expect(mockJson).toBeCalledWith({
      error: 'Internal Server Error',
      errorCodes: [],
      message: 'Correlation ID: 275193e6-93f0-4a3a-834b-d9e2afd73056',
      messages: ['Correlation ID: 275193e6-93f0-4a3a-834b-d9e2afd73056'],
      statusCode: 500,
    });
  });

  it('should return internal server error when unknown error is thrown', () => {
    const exception = new Error('Message');

    exceptionFilter.catch(exception, mockArgumentsHost);
    expect(mockErrorLog).toBeCalled();
    expect(mockStatus).toBeCalledWith(500);
    expect(mockJson).toBeCalledWith({
      error: 'Internal Server Error',
      errorCodes: [],
      message: 'Correlation ID: 275193e6-93f0-4a3a-834b-d9e2afd73056',
      messages: ['Correlation ID: 275193e6-93f0-4a3a-834b-d9e2afd73056'],
      statusCode: 500,
    });
  });

  it('should return internal server error when invalid http error is send', () => {
    const exception = new HttpException('Message', 600);

    exceptionFilter.catch(exception, mockArgumentsHost);
    expect(mockErrorLog).toBeCalled();
    expect(mockStatus).toBeCalledWith(500);
    expect(mockJson).toBeCalledWith({
      error: 'Internal Server Error',
      errorCodes: [],
      message: 'Correlation ID: 275193e6-93f0-4a3a-834b-d9e2afd73056',
      messages: ['Correlation ID: 275193e6-93f0-4a3a-834b-d9e2afd73056'],
      statusCode: 500,
    });
  });

  it('should return internal server error when internal server error is thrown', () => {
    const exception = new InternalServerErrorException('Message');

    exceptionFilter.catch(exception, mockArgumentsHost);
    expect(mockErrorLog).toBeCalled();
    expect(mockStatus).toBeCalledWith(500);
    expect(mockJson).toBeCalledWith({
      error: 'Internal Server Error',
      errorCodes: [],
      message: 'Correlation ID: 275193e6-93f0-4a3a-834b-d9e2afd73056',
      messages: ['Correlation ID: 275193e6-93f0-4a3a-834b-d9e2afd73056'],
      statusCode: 500,
    });
  });
});
