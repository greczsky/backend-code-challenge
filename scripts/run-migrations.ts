import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';

import { initConfig } from 'config/helpers/init-config.helper';
import { DataRepositoriesModule } from 'src/modules/data-repositories/data-repositories.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
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
