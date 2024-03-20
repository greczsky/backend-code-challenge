import { GeneralExceptionFilter } from 'commons-nestjs';
import { LOGGER_365 } from 'logger-nestjs';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

import { AppModule } from './app.module';
import { ServiceUnavailableExceptionFilter } from './exception-filters/service-unavailable.exception-filter';
import { getSwaggerDocument } from './get-swagger';

import type { Config } from '../config/interfaces/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = getSwaggerDocument(app);
  SwaggerModule.setup('doc', app, document);

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new GeneralExceptionFilter(httpAdapterHost.httpAdapter, await app.resolve(LOGGER_365)),
    new ServiceUnavailableExceptionFilter(await app.resolve(LOGGER_365)),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService: ConfigService<Config, true> = app.get(ConfigService);
  const port = configService.get('port', { infer: true });
  await app.listen(port);
}
void bootstrap();
