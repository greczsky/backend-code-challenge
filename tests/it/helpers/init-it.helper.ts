import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { AppModule } from 'src/app.module';
import { transformValidationErrors } from 'src/validation/validation.helper';

import type { TestingModule } from '@nestjs/testing';

export async function initTestingModule(module: TestingModule) {
  const app = module.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => transformValidationErrors(errors),
      transformOptions: {
        exposeUnsetFields: false,
      },
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app.init();
}
