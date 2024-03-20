import type { OrderDirection } from 'commons-nestjs';
import type { ExampleOrderColumn } from 'src/modules/data-repositories/types/enums';

export interface GetExampleResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface GetAllExamples {
  from: number;
  size?: number;
  orderBy?: ExampleOrderColumn;
  direction: OrderDirection;
}

export interface GetAllExamplesResponse {
  examples: {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    modifiedAt: Date;
  }[];
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

export interface CreateExampleResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  modifiedAt: Date;
}
