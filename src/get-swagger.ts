import { readFileSync } from 'fs';

import { Environment } from 'commons-nestjs';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { version, name } from 'package.json';

import { ERROR_DETAILS } from './error/types/enums';

import type { INestApplication } from '@nestjs/common';
import type { Config } from 'config/interfaces/config.interface';

const generateErrorCodeSection = () => {
  let errorCodeSection = `

  Error codes that can be returned from API in \`errorCodes\` field

  | Error code | Description |
  | - | - |
  `;

  for (const { code, description } of ERROR_DETAILS) {
    errorCodeSection = errorCodeSection.concat(`| \`${code}\` | ${description} |\n`);
  }

  return `<details><summary>**Error codes**</summary>${errorCodeSection}</details>`;
};

export const getSwaggerDocument = (app: INestApplication) => {
  const configService: ConfigService<Config, true> = app.get(ConfigService);
  const lastIndex = version.lastIndexOf('.');
  const packageVersion = version.substring(0, lastIndex);
  const isProduction = configService.get('nodeEnv', { infer: true }) === Environment.Production;

  // Get description from markdown
  const header = readFileSync(__dirname + '/../docs/description.md', 'utf-8');
  const errorCodeSection = generateErrorCodeSection();
  const description = `${header}<br /><br /> ${errorCodeSection}`;

  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(packageVersion)
    .addSecurity('bearerAuth', {
      type: 'http',
      scheme: 'bearer',
    });

  if (isProduction) {
    // In production routes are prefixed therefore we have to provide this prefix to swagger
    documentBuilder.addServer('/api/eks-bootstrap');
  }
  const config = documentBuilder.build();
  return SwaggerModule.createDocument(app, config);
};
