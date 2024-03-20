import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export type Order = 'ASC' | 'DESC';

export interface PagingQuery {
  cursor?: string;
  limit?: number;
  offset?: number;
  order?: 'ASC' | 'DESC';
}

export type PaginationKeys<T> = [keyof T, (keyof T)?];

export interface PaginationOptions<T> {
  alias: string;
  query?: PagingQuery;
  paginationKeys: PaginationKeys<T>;
}

interface CursorParam {
  [key: string]: string;
}

export interface Pagination {
  cursor: Cursor;
  totalCount: number;
  pageSize: number;
  currentPage?: number;
}

export interface Cursor {
  before: string | null;
  after: string | null;
}

export interface PagingResult<E> {
  data: E[];
  pagination: Pagination;
}

export class PaginationService<T extends ObjectLiteral> {
  private cursor: string | null = null;

  private nextAfterCursor: string | null = null;

  private nextBeforeCursor: string | null = null;

  private paginationKeys: PaginationKeys<T>;

  private alias: string;

  private limit: number | null = null;

  private offset = 0;

  private getAfterRecords = true;

  private order: Order = 'DESC';

  private totalCount = 0;

  constructor(options: PaginationOptions<T>) {
    const { alias, query = {}, paginationKeys } = options;

    this.alias = alias;
    this.paginationKeys = paginationKeys;

    if (query.cursor) {
      this.cursor = query.cursor;
    }

    if (query.limit) {
      this.getAfterRecords = query.limit > 0 ? true : false;
      this.limit = Math.abs(query.limit);
    }

    if (query.offset) {
      this.offset = query.offset;
    }

    if (query.order) {
      this.order = query.order;
    }
  }

  async paginate(builder: SelectQueryBuilder<T>): Promise<PagingResult<T>> {
    if (!this.limit) {
      // Ignore offset and get all records
      const entities = await builder.getMany();
      this.totalCount = entities.length;
      return this.toPagingResult(entities);
    }

    this.totalCount = await builder.getCount();

    if (!this.hasCursor()) {
      builder.skip(this.offset);
    }

    const entities = await this.appendPagingQuery(builder).getMany();

    const hasMore = entities.length > this.limit;

    if (hasMore) {
      entities.splice(entities.length - 1, 1);
    }

    if (entities.length === 0) {
      return this.toPagingResult(entities);
    }

    if (this.hasCursor() && this.isBeforeCursor()) {
      entities.reverse();
    }

    if ((this.hasCursor() && this.isBeforeCursor()) || hasMore) {
      this.nextAfterCursor = this.encode(entities[entities.length - 1]);
    }

    if (
      (this.hasCursor() && (this.isAfterCursor() || (hasMore && this.isBeforeCursor()))) ||
      this.offset > 0
    ) {
      this.nextBeforeCursor = this.encode(entities[0]);
    }

    return this.toPagingResult(entities);
  }

  private appendPagingQuery(builder: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
    if (this.cursor) {
      const cursorParam = this.decode(this.cursor);

      if (this.isCursorValid(cursorParam)) {
        this.buildCursorQuery(builder, cursorParam);
      }
    }

    if (this.limit) {
      builder.take(this.limit + 1);
    }

    this.buildOrder(builder);

    return builder;
  }

  private buildCursorQuery(builder: SelectQueryBuilder<T>, cursors: CursorParam): void {
    const operator = this.getOperator();
    let query = '';
    this.paginationKeys.forEach((key) => {
      if (key) {
        builder.orWhere(`${query}${this.alias}.${String(key)} ${operator} :${String(key)}`, {
          [String(key)]: cursors[String(key)],
        });
        query = `${query}${this.alias}.${String(key)} = :${String(key)} AND `;
      }
    });
  }

  private buildOrder(builder: SelectQueryBuilder<T>): void {
    let { order } = this;
    if (this.hasCursor() && this.isBeforeCursor()) {
      order = this.flipOrder(order);
    }

    for (const key of this.paginationKeys) {
      if (!key) {
        continue;
      }

      const orderByColumnName = `${this.alias}.${String(key)}`;
      builder.addOrderBy(orderByColumnName, order);
    }
  }

  private isCursorValid(cursors: CursorParam): boolean {
    for (const paginationKey of this.paginationKeys) {
      if (paginationKey && paginationKey in cursors === false) {
        return false;
      }
    }
    return true;
  }

  private getOperator(): string {
    if (this.isAfterCursor()) {
      return this.order === 'ASC' ? '>' : '<';
    } else {
      return this.order === 'ASC' ? '<' : '>';
    }
  }

  private flipOrder(order: Order): Order {
    return order === 'ASC' ? 'DESC' : 'ASC';
  }

  private hasCursor(): boolean {
    return this.cursor !== null;
  }

  private isAfterCursor(): boolean {
    return this.getAfterRecords;
  }

  private isBeforeCursor(): boolean {
    return this.getAfterRecords === false;
  }

  private encode(entity: T): string {
    const cursors: CursorParam = {};

    this.paginationKeys.forEach((key) => {
      if (key) {
        cursors[String(key)] = String(entity[key]);
      }
    });

    const payload = JSON.stringify(cursors);
    return Buffer.from(payload).toString('base64');
  }

  private decode(cursor: string): CursorParam {
    const payload = Buffer.from(cursor, 'base64').toString();
    try {
      return JSON.parse(payload) as CursorParam;
    } catch (error) {
      return {};
    }
  }

  private toPagingResult(entities: T[]): PagingResult<T> {
    let currentPage = 1;
    if (this.limit) {
      currentPage = Math.ceil(this.offset / this.limit) + 1;
    }

    return {
      data: entities,
      pagination: {
        currentPage: !this.hasCursor() ? currentPage : undefined,
        totalCount: this.totalCount,
        pageSize: this.limit ? this.limit : this.totalCount,
        cursor: {
          after: this.nextAfterCursor,
          before: this.nextBeforeCursor,
        },
      },
    };
  }
}
