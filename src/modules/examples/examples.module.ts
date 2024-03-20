import { Module } from '@nestjs/common';

import { ExampleAdapter } from 'src/adapters/example/example.adapter';
import { makeInjectable } from 'src/helpers/injection/injection.helper';

import { ExamplesController } from './examples.controller';
import { ExamplesService } from './services/examples/examples.service';

import { DataRepositoriesModule } from '../data-repositories/data-repositories.module';

@Module({
  imports: [DataRepositoriesModule],
  controllers: [ExamplesController],
  providers: [ExamplesService, makeInjectable(ExampleAdapter)],
})
export class ExamplesModule {}
