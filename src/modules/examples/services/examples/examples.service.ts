import { CustomNotFoundException } from 'commons-nestjs';
import { Logger, LOGGER_365 } from 'logger-nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ExampleAdapter } from 'src/adapters/example/example.adapter';
import { ErrorCode } from 'src/error/types/enums';
import { ExamplesRepository } from 'src/modules/data-repositories/repositories/examples.repository';

import type {
  CreateExample,
  CreateExampleResponse,
  GetAllExamples,
  GetAllExamplesResponse,
  GetExampleResponse,
} from './types/interfaces';
import type { Config } from 'config/interfaces/config.interface';

@Injectable()
export class ExamplesService {
  constructor(
    private examplesRepository: ExamplesRepository,
    private exampleAdapter: ExampleAdapter,
    @Inject(LOGGER_365) private logger: Logger,
    @Inject(ConfigService) private config: ConfigService<Config, true>,
  ) {}

  async create(createExample: CreateExample): Promise<CreateExampleResponse> {
    return this.examplesRepository.createExample(createExample);
  }

  async get(id: string): Promise<GetExampleResponse> {
    this.logger.info('examplesModule.examplesService.get.input', {
      id,
      info: 'example info',
    });
    try {
      return await this.examplesRepository.getExample(id);
    } catch (error) {
      // Logger and error example usage
      this.logger.warn('examplesModule.examplesService.get.notFoundException', { id });

      throw new CustomNotFoundException({
        message: 'Example not found',
        errorCodes: [ErrorCode.exampleNotFound],
      });
    }
  }

  async getAll(getAllExamples: GetAllExamples): Promise<GetAllExamplesResponse> {
    this.logger.info('examplesModule.examplesService.getAll.input', getAllExamples);
    // Call the adapter function just for usage demonstration
    this.exampleAdapter.doSomething();

    const examples = await this.examplesRepository.getAllExamples(getAllExamples);

    this.logger.info('examplesModule.examplesService.getAll.result', examples);

    return examples;
  }
}
