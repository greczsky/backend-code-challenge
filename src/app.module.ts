import { CorrelationIdMiddleware } from 'commons-nestjs';
import { Logger365Module } from 'logger-nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { redactConfig } from './constants/logger.constant';
import { ExamplesModule } from './modules/examples/examples.module';
import { HealthModule } from './modules/health/health.module';
import { MetricsModule } from './modules/metrics/metrics.module';

import { EnvironmentVarsDto } from '../config/dtos/environment-vars.dto';
import { validateEnvironmentVariables } from '../config/helpers/env-validation.helper';
import { initConfig } from '../config/helpers/init-config.helper';

import type { Config } from '../config/interfaces/config.interface';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';

@Module({
  imports: [
    MetricsModule,
    HealthModule,
    ConfigModule.forRoot({
      load: [initConfig],
      validate: (config) => validateEnvironmentVariables(config, EnvironmentVarsDto),
      isGlobal: true,
    }),
    Logger365Module.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => {
        const mainContext = configService.get('logContext', { infer: true });
        const logLevel = configService.get('logLevel', { infer: true });

        return {
          mainContext,
          logLevel,
          redactConfig,
        };
      },
    }),
    ExamplesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
