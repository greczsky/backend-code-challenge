import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { Example } from '../entities/example.entity';
import { PaginationService } from '../services/pagination/pagination.service';

import type { PaginationKeys } from '../services/pagination/pagination.service';
import type { CreateExample, GetAllExamples, GetAllExamplesResponse } from '../types/interfaces';

@Injectable()
export class ExamplesRepository {
  constructor(private manager: EntityManager) {}

  async getExample(id: string): Promise<Example> {
    const example = await this.manager
      .createQueryBuilder(Example, 'examples')
      .where('examples.id = :id', { id })
      .getOne();
    if (!example) {
      throw new NotFoundException('Example not found');
    }
    return example;
  }

  async getAllExamples(getAllExamples: GetAllExamples): Promise<GetAllExamplesResponse> {
    const queryBuilder = this.manager.createQueryBuilder(Example, 'examples');

    const { from: fromPage, size: limit, direction, orderBy } = getAllExamples;

    const paginationKeys: PaginationKeys<Example> = orderBy ? [orderBy, 'id'] : ['id'];

    const paginationService = new PaginationService<Example>({
      alias: 'examples',
      paginationKeys,
      query: {
        limit,
        offset: limit != null ? fromPage * limit : undefined,
        order: direction,
      },
    });

    const { data, pagination } = await paginationService.paginate(queryBuilder);

    return {
      examples: data,
      pagination: {
        currentResultPage: pagination.currentPage ?? 1,
        totalNumberOfResults: pagination.totalCount,
        pageSize: pagination.pageSize,
      },
    };
  }

  async createExample(createExample: CreateExample): Promise<CreateExample & Example> {
    return this.manager.save(Example, createExample);
  }
}
