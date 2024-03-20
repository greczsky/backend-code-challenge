import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { version, name } from 'package.json';

import { Environment } from './types/enums';

import type { INestApplication } from '@nestjs/common';
import type { Config } from 'config/interfaces/config.interface';

export const getSwaggerDocument = (app: INestApplication) => {
  const configService: ConfigService<Config, true> = app.get(ConfigService);
  const lastIndex = version.lastIndexOf('.');
  const packageVersion = version.substring(0, lastIndex);
  const isProduction = configService.get('nodeEnv', { infer: true }) === Environment.Production;

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setVersion(packageVersion)
    .addSecurity('bearerAuth', {
      type: 'http',
      scheme: 'bearer',
    });

  if (isProduction) {
    // In production routes are prefixed therefore we have to provide this prefix to swagger
    documentBuilder.addServer('/api/pokemon');
  }
  const config = documentBuilder.build();
  return SwaggerModule.createDocument(app, config);
};
