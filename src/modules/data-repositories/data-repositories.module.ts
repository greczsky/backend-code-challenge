import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Example } from './entities/example.entity';
import { ExamplesRepository } from './repositories/examples.repository';

import type { Config } from 'config/interfaces/config.interface';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config, true>) => {
        const config = { url: configService.get('db.postgres.url', { infer: true }) };

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
