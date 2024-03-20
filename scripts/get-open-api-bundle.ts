import * as fs from 'fs';

import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';
import { getSwaggerDocument } from 'src/get-swagger';

async function run() {
  const app = await NestFactory.create(AppModule, { autoFlushLogs: false });
  const document = getSwaggerDocument(app);
  fs.writeFileSync('./open-api/openapi-bundle.json', JSON.stringify(document));
  console.log('Open api file created!');
  await app.close();
}

void run();
