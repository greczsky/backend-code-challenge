import { getSecret } from 'common';
import { Environment } from 'commons-nestjs';
import { LOGGER_365 } from 'logger-nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Example } from './entities/example.entity';
import { ExamplesRepository } from './repositories/examples.repository';

import type { Logger } from 'logger-nestjs';
import type { Config } from 'config/interfaces/config.interface';

interface RdsSecret {
  host: string;
  port: number;
  dbname: string;
  username: string;
  password: string;
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, LOGGER_365],
      useFactory: async (configService: ConfigService<Config, true>, logger: Logger) => {
        const nodeEnv = configService.get('nodeEnv', { infer: true });
        const isProduction = nodeEnv === Environment.Production;

        let config:
          | { url: string }
          | { host: string; port: number; username: string; password: string; database: string };

        if (isProduction) {
          // In production we're getting db connection string from secret manager
          const secretId = configService.get('aws.secretManager.rdsConnection.secretName', {
            infer: true,
          });

          const secret = JSON.parse(await getSecret({ secretId, logger })) as RdsSecret;

          config = {
            host: secret.host,
            port: secret.port,
            database: secret.dbname,
            username: secret.username,
            password: secret.password,
          };
        } else {
          config = { url: configService.get('db.postgres.url', { infer: true }) };
        }

        return {
          ...config,
          type: 'postgres',
          synchronize: false,
          autoLoadEntities: true,
          logging: configService.get('db.postgres.logging', { infer: true }),
          migrationsRun: configService.get('db.postgres.migrationsRun', { infer: true }),
          migrations: [configService.get('db.postgres.migrations', { infer: true }) ?? ''],
        };
      },
    }),
    TypeOrmModule.forFeature([Example]),
  ],
  controllers: [],
  providers: [ExamplesRepository],
  exports: [ExamplesRepository],
})
export class DataRepositoriesModule {}
