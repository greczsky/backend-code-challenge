import { OrderDirection } from 'commons-nestjs';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { ExampleOrderColumn } from 'src/modules/data-repositories/types/enums';

export class GetAllExamplesRequestDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({
    description: 'Page number, how many pages to skip.',
    default: 0,
    example: 0,
    minimum: 0,
    type: 'integer',
  })
  @Type(() => Number)
  from: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    description: `Pagination limit. Maximum size of the examples at one page.`,
    example: 10,
    minimum: 1,
    maximum: 100,
    type: 'integer',
    default: 10,
  })
  @Type(() => Number)
  size: number = 10;

  @IsOptional()
  @IsEnum(ExampleOrderColumn)
  @ApiPropertyOptional({
    description: 'Order by field.',
    example: ExampleOrderColumn.name,
    enum: ExampleOrderColumn,
  })
  orderBy?: ExampleOrderColumn;

  @IsOptional()
  @IsEnum(OrderDirection)
  @ApiPropertyOptional({
    description: 'Order direction.',
    default: OrderDirection.DESC,
    example: 'DESC',
    enum: OrderDirection,
  })
  direction: OrderDirection = OrderDirection.DESC;
}
