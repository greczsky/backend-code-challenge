import { Logger365Module } from 'logger-nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { initConfig } from 'config/helpers/init-config.helper';
import { redactConfig } from 'src/constants/logger.constant';
import { DataRepositoriesModule } from 'src/modules/data-repositories/data-repositories.module';

import type { Config } from 'config/interfaces/config.interface';

@Module({
  imports: [
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
    DataRepositoriesModule,
    ConfigModule.forRoot({
      load: [initConfig],
      isGlobal: true,
    }),
  ],
  providers: [],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.close();
}
void bootstrap();
