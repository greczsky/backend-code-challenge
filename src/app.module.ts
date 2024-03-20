import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { CorrelationIdMiddleware } from './middlewares/correlation-id.middleware';
import { ExamplesModule } from './modules/examples/examples.module';
import { PokemonModule } from './modules/pokemon/pokemon.module';

import { EnvironmentVarsDto } from '../config/dtos/environment-vars.dto';
import { validateEnvironmentVariables } from '../config/helpers/env-validation.helper';
import { initConfig } from '../config/helpers/init-config.helper';

import type { MiddlewareConsumer, NestModule } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [initConfig],
      validate: (config) => validateEnvironmentVariables(config, EnvironmentVarsDto),
      isGlobal: true,
    }),
    LoggerModule.forRoot(),
    ExamplesModule,
    PokemonModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
