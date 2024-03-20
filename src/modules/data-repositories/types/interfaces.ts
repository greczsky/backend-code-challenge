import type { ExampleOrderColumn } from './enums';
import type { Example } from '../entities/example.entity';
import type { OrderDirection } from 'commons-nestjs';

export interface GetAllExamples {
  from: number;
  size?: number;
  orderBy?: ExampleOrderColumn;
  direction: OrderDirection;
}

export interface GetAllExamplesResponse {
  examples: Example[];
  pagination: {
    currentResultPage: number;
    totalNumberOfResults: number;
    pageSize: number;
  };
}

export interface CreateExample {
  name: string;
  description?: string;
}
