/* eslint-disable @typescript-eslint/require-await */
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LOGGER_365 } from 'logger-nestjs';

import { ExampleAdapter } from 'src/adapters/example/example.adapter';
import { ExamplesRepository } from 'src/modules/data-repositories/repositories/examples.repository';

import { ExamplesService } from './examples.service';

import type { TestingModule } from '@nestjs/testing';

describe('ExamplesService', () => {
  let service: ExamplesService;
  let spyConfigService: ConfigService;
  const mockConfigService = (key: string): string => {
    console.log("Mocking ConfigService for key '" + key + "'.");
    switch (key) {
      default:
        return 'Mocked_' + key;
    }
  };

  beforeAll(async () => {
    const ConfigServiceProvider = {
      provide: ConfigService,
      useFactory: () => ({
        get: jest.fn(() => {}),
      }),
    };

    const ExamplesRepositoryProvider = {
      provide: ExamplesRepository,
      useFactory: () => ({
        createExample: jest.fn(async () => ({})),
        getExample: jest.fn(async () => ({})),
        getAllExamples: jest.fn(async () => []),
      }),
    };

    const ExampleAdapterProvider = {
      provide: ExampleAdapter,
      useFactory: () => ({
        doSomething: jest.fn(() => ({})),
      }),
    };

    const LoggerProvider = {
      provide: LOGGER_365,
      useFactory: () => ({
        info: jest.fn(() => ({})),
        error: jest.fn(() => ({})),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamplesService,
        ConfigServiceProvider,
        ExamplesRepositoryProvider,
        ExampleAdapterProvider,
        LoggerProvider,
      ],
    }).compile();

    service = module.get<ExamplesService>(ExamplesService);
    spyConfigService = module.get<ConfigService>(ConfigService);
    jest.spyOn(spyConfigService, 'get').mockImplementation(mockConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
