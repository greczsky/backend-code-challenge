import { ApiProperty } from '@nestjs/swagger';

export class ResultSetDescriptorDto {
  @ApiProperty({
    description: 'Number of current result page.',
    example: 1,
    type: 'integer',
  })
  currentResultPage!: number;

  @ApiProperty({
    description: 'Total number of results (number of records at all pages).',
    example: 53,
    type: 'integer',
  })
  totalNumberOfResults!: number;

  @ApiProperty({
    description: 'Maximum number of records at one page.',
    example: 2,
    type: 'integer',
  })
  pageSize!: number;
}
