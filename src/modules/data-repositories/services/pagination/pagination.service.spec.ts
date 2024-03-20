import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Column, DataSource, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';

import { PaginationService } from './pagination.service';

import type { INestApplication } from '@nestjs/common';

@Entity({
  name: 'documents',
})
export class Document {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id!: string;

  @Column({
    name: 'account_id',
  })
  accountId!: string;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: 'now()',
  })
  createdAt!: Date;
}

describe('PaginationService', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './data/documents.sqlite',
          synchronize: true,
          entities: [Document],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
  });

  beforeEach(async () => {
    await app.get(DataSource).synchronize(true);
  });

  afterAll(async () => {
    await app.get(DataSource).dropDatabase();
    await app.get(DataSource).destroy();
  });

  describe('Cursor pagination', () => {
    it('should paginate correctly with after cursor', async () => {
      for (let i = 0; i <= 2; i++) {
        const documentsRepository = app.get(DataSource).getRepository(Document);
        await documentsRepository.save({
          accountId: `account_${i}`,
        });
      }

      const queryBuilder = app.get(DataSource).createQueryBuilder(Document, 'documents');

      const firstPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId', 'id'],
        query: {
          limit: 1,
          order: 'ASC',
        },
      });

      const firstPageResult = await firstPagePaginatorService.paginate(queryBuilder.clone());

      const firstPageDocuments = firstPageResult.data;

      expect(firstPageResult.pagination.totalCount).toEqual(3);
      expect(firstPageResult.pagination.pageSize).toEqual(1);

      expect(firstPageResult.pagination.cursor.before).toEqual(null);
      expect(firstPageResult.pagination.cursor.after).not.toEqual(null);
      expect(firstPageDocuments[0].accountId).toEqual('account_0');

      const secondPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId', 'id'],
        query: {
          limit: 1,
          order: 'ASC',
          cursor: firstPageResult.pagination.cursor.after ?? undefined,
        },
      });

      const secondPageResult = await secondPagePaginatorService.paginate(queryBuilder.clone());
      const secondPageDocuments = secondPageResult.data;

      expect(secondPageResult.pagination.cursor.before).not.toEqual(null);
      expect(secondPageResult.pagination.cursor.after).not.toEqual(null);
      expect(secondPageDocuments[0].accountId).toEqual('account_1');

      const thirdPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId', 'id'],
        query: {
          limit: 1,
          order: 'ASC',
          cursor: secondPageResult.pagination.cursor.after ?? undefined,
        },
      });

      const thirdPageResult = await thirdPagePaginatorService.paginate(queryBuilder);
      const thirdPageDocuments = thirdPageResult.data;

      expect(thirdPageResult.pagination.cursor.before).not.toEqual(null);
      expect(thirdPageResult.pagination.cursor.after).toEqual(null);
      expect(thirdPageDocuments[0].accountId).toEqual('account_2');
    });

    it('should paginate correctly with before cursor', async () => {
      for (let i = 0; i <= 2; i++) {
        const documentsRepository = app.get(DataSource).getRepository(Document);
        await documentsRepository.save({
          accountId: `account_${i}`,
        });
      }

      const queryBuilder = app.get(DataSource).createQueryBuilder(Document, 'documents');

      const firstPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId', 'id'],
        query: {
          offset: 2,
          limit: 1,
          order: 'ASC',
        },
      });

      const firstPageResult = await firstPagePaginatorService.paginate(queryBuilder.clone());
      const firstPageDocuments = firstPageResult.data;

      expect(firstPageDocuments[0].accountId).toEqual('account_2');

      const secondPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId', 'id'],
        query: {
          limit: -1,
          order: 'ASC',
          cursor: firstPageResult.pagination.cursor.before ?? undefined,
        },
      });

      const secondPageResult = await secondPagePaginatorService.paginate(queryBuilder.clone());
      const secondPageDocuments = secondPageResult.data;

      expect(secondPageDocuments[0].accountId).toEqual('account_1');

      const thirdPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId', 'id'],
        query: {
          limit: -1,
          order: 'ASC',
          cursor: secondPageResult.pagination.cursor.before ?? undefined,
        },
      });

      const thirdPageResult = await thirdPagePaginatorService.paginate(queryBuilder.clone());
      const thirdPageDocuments = thirdPageResult.data;

      expect(thirdPageDocuments[0].accountId).toEqual('account_0');
    });

    it('should paginate correctly only with one paginationKey column', async () => {
      for (let i = 0; i <= 2; i++) {
        const documentsRepository = app.get(DataSource).getRepository(Document);
        await documentsRepository.save({
          accountId: `account_${i}`,
        });
      }

      const queryBuilder = app.get(DataSource).createQueryBuilder(Document, 'documents');

      const firstPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId'],
        query: {
          limit: 1,
          order: 'ASC',
        },
      });

      const firstPageResult = await firstPagePaginatorService.paginate(queryBuilder.clone());

      const firstPageDocuments = firstPageResult.data;

      expect(firstPageResult.pagination.totalCount).toEqual(3);
      expect(firstPageResult.pagination.pageSize).toEqual(1);

      expect(firstPageResult.pagination.cursor.before).toEqual(null);
      expect(firstPageResult.pagination.cursor.after).not.toEqual(null);
      expect(firstPageDocuments[0].accountId).toEqual('account_0');

      const secondPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId'],
        query: {
          limit: 1,
          order: 'ASC',
          cursor: firstPageResult.pagination.cursor.after ?? undefined,
        },
      });

      const secondPageResult = await secondPagePaginatorService.paginate(queryBuilder.clone());
      const secondPageDocuments = secondPageResult.data;

      expect(secondPageResult.pagination.cursor.before).not.toEqual(null);
      expect(secondPageResult.pagination.cursor.after).not.toEqual(null);
      expect(secondPageDocuments[0].accountId).toEqual('account_1');

      const thirdPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId'],
        query: {
          limit: 1,
          order: 'ASC',
          cursor: secondPageResult.pagination.cursor.after ?? undefined,
        },
      });

      const thirdPageResult = await thirdPagePaginatorService.paginate(queryBuilder);

      const thirdPageDocuments = thirdPageResult.data;

      expect(thirdPageResult.pagination.cursor.before).not.toEqual(null);
      expect(thirdPageResult.pagination.cursor.after).toEqual(null);
      expect(thirdPageDocuments[0].accountId).toEqual('account_2');
    });
  });

  describe('Page pagination', () => {
    it('should paginate correctly with page pagination', async () => {
      for (let i = 0; i <= 9; i++) {
        const documentsRepository = app.get(DataSource).getRepository(Document);
        await documentsRepository.save({
          accountId: `account_${i}`,
        });
      }

      const queryBuilder = app.get(DataSource).createQueryBuilder(Document, 'documents');

      const firstPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId', 'id'],
        query: {
          offset: 2,
          limit: 2,
          order: 'ASC',
        },
      });

      const firstPageResult = await firstPagePaginatorService.paginate(queryBuilder.clone());
      const firstPageDocuments = firstPageResult.data;

      expect(firstPageResult.data).toHaveLength(2);
      expect(firstPageResult.pagination.totalCount).toEqual(10);
      expect(firstPageResult.pagination.pageSize).toEqual(2);
      expect(firstPageResult.pagination.currentPage).toEqual(2);

      expect(firstPageDocuments[0].accountId).toEqual('account_2');
      expect(firstPageDocuments[1].accountId).toEqual('account_3');

      const secondPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId', 'id'],
        query: {
          offset: 4,
          limit: 2,
          order: 'ASC',
        },
      });

      const secondPageResult = await secondPagePaginatorService.paginate(queryBuilder.clone());
      const secondPageDocuments = secondPageResult.data;

      expect(secondPageResult.data).toHaveLength(2);
      expect(secondPageResult.pagination.totalCount).toEqual(10);
      expect(secondPageResult.pagination.pageSize).toEqual(2);
      expect(secondPageResult.pagination.currentPage).toEqual(3);

      expect(secondPageDocuments[0].accountId).toEqual('account_4');
      expect(secondPageDocuments[1].accountId).toEqual('account_5');
    });

    it('should return all records when limit is not specified', async () => {
      for (let i = 0; i < 4; i++) {
        const documentsRepository = app.get(DataSource).getRepository(Document);
        await documentsRepository.save({
          accountId: `account_${i}`,
        });
      }

      const queryBuilder = app.get(DataSource).createQueryBuilder(Document, 'documents');

      const firstPagePaginatorService = new PaginationService<Document>({
        alias: 'documents',
        paginationKeys: ['accountId'],
        query: {
          offset: 2, // offset should be ignored
          order: 'ASC',
        },
      });

      const firstPageResult = await firstPagePaginatorService.paginate(queryBuilder.clone());
      const firstPageDocuments = firstPageResult.data;

      expect(firstPageResult.data).toHaveLength(4);
      expect(firstPageResult.pagination.totalCount).toEqual(4);
      expect(firstPageResult.pagination.pageSize).toEqual(4);
      expect(firstPageResult.pagination.currentPage).toEqual(1);

      expect(firstPageDocuments[0].accountId).toEqual('account_0');
      expect(firstPageDocuments[1].accountId).toEqual('account_1');
      expect(firstPageDocuments[2].accountId).toEqual('account_2');
      expect(firstPageDocuments[3].accountId).toEqual('account_3');
    });
  });
});
