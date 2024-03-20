/* eslint-disable @typescript-eslint/require-await */
import { Test } from '@nestjs/testing';

import { ExamplesController } from './examples.controller';
import { ExamplesService } from './services/examples/examples.service';

import type { TestingModule } from '@nestjs/testing';

describe('ExamplesController', () => {
  let controller: ExamplesController;

  beforeAll(async () => {
    const ExamplesServiceProvider = {
      provide: ExamplesService,
      useFactory: () => ({
        getAll: jest.fn(async () => ({
          pagination: {
            currentResultPage: 1,
            totalNumberOfResults: 2,
            pageSize: 2,
          },
          examples: [
            {
              id: '123456',
              name: 'My example',
              description: 'Lorem ipsum',
              createdAt: '2021-12-16T13:47:06.051Z',
              modifiedAt: '2021-12-16T13:47:06.051Z',
            },
          ],
        })),
        get: jest.fn(async () => ({})),
        create: jest.fn(async () => ({
          id: '123456',
          name: 'My example',
          description: 'Lorem ipsum',
          createdAt: '2021-12-16T13:47:06.051Z',
        })),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamplesController],
      providers: [ExamplesServiceProvider],
    }).compile();

    controller = module.get<ExamplesController>(ExamplesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
