import type { Logger } from 'logger-nestjs';

export function mockLogger(logger: Logger) {
  jest.spyOn(logger, 'debug').mockImplementation();
  jest.spyOn(logger, 'info').mockImplementation();
  jest.spyOn(logger, 'warn').mockImplementation();
  jest.spyOn(logger, 'error').mockImplementation();
}
