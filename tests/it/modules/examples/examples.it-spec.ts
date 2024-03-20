import { Test } from '@nestjs/testing';
import { refreshDb } from 'src/modules/common/helpers/test/test.helper';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { AppModule } from 'src/app.module';
import { initTestingModule } from 'tests/it/helpers/init-it.helper';

import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import type { ExampleDto } from 'src/modules/examples/dto/common/example.dto';
import type { ExampleResponseDto } from 'src/modules/examples/dto/response/common/example-response.dto';
import type { GetAllExamplesResponseDto } from 'src/modules/examples/dto/response/get-all-examples/get-all-examples-response.dto';

const timestamp = new Date().valueOf();

jest.setTimeout(50 * 1000);

describe('Examples (it)', () => {
  let app: INestApplication;

  const createdExamples: ExampleDto[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await initTestingModule(moduleFixture);
    const dataSource = app.get(DataSource);
    await refreshDb(dataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('test example create', () => {
    it('should create example with name and description', async () => {
      const response = await request(app.getHttpServer())
        .post('/examples')
        .set('Content-type', 'application/json')
        .send({
          name: `Example name 1 - ${timestamp}`,
          description: 'Lorem ipsum',
        })
        .expect(201);

      createdExamples.push(response.body as ExampleResponseDto);
    });

    it('should create example with name only', async () => {
      const response = await request(app.getHttpServer())
        .post('/examples')
        .set('Content-type', 'application/json')
        .send({
          name: `Example name 2 - ${timestamp}`,
        })
        .expect(201);

      createdExamples.push(response.body as ExampleResponseDto);
    });

    it('should not create example without name', async () => {
      await request(app.getHttpServer())
        .post('/examples')
        .set('Content-type', 'application/json')
        .send({
          description: 'Lorem ipsum',
        })
        .expect(400);
    });
  });

  it('should test get all examples', async () => {
    const response = await request(app.getHttpServer())
      .get('/examples')
      .set('Content-type', 'application/json')
      .query({
        direction: 'ASC',
        from: 0,
        size: 5,
        orderBy: 'name',
      })
      .expect(200);

    const body = response.body as GetAllExamplesResponseDto;

    expect(body.resultSetDescriptor.pageSize).toEqual(5);
    expect(body.resultSetDescriptor.currentResultPage).toEqual(1);
    expect(body.resultSetDescriptor.totalNumberOfResults).toBeGreaterThanOrEqual(2);
    expect(body.resultSet?.length).toBeTruthy();
    expect(body.resultSet.length).toBeGreaterThanOrEqual(2);
  });

  describe('test get example', () => {
    it('should get first example', async () => {
      const res = await request(app.getHttpServer())
        .get(`/examples/${createdExamples[0].id}`)
        .set('Content-type', 'application/json')
        .expect(200);

      const body = res.body as ExampleResponseDto;

      expect(body.id).toEqual(createdExamples[0].id);
      expect(body.name).toEqual(createdExamples[0].name);
      expect(body.description).toEqual(createdExamples[0].description);
    });

    it('should get second example', async () => {
      const res = await request(app.getHttpServer())
        .get(`/examples/${createdExamples[1].id}`)
        .set('Content-type', 'application/json')
        .expect(200);

      const body = res.body as ExampleResponseDto;

      expect(body.id).toEqual(createdExamples[1].id);
      expect(body.name).toEqual(createdExamples[1].name);
      expect(body.description).toBeFalsy();
    });
  });
});
