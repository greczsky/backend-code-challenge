import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { GeneralExceptionFilter } from './exception-filters/general.exception-filter';
import { getSwaggerDocument } from './get-swagger';

import type { Config } from '../config/interfaces/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = getSwaggerDocument(app);
  SwaggerModule.setup('doc', app, document);

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new GeneralExceptionFilter(httpAdapterHost.httpAdapter, await app.resolve(Logger)),
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
