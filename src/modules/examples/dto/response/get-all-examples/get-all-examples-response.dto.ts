import { ApiProperty } from '@nestjs/swagger';

import { ExampleResponseDto } from '../common/example-response.dto';
import { ResultSetDescriptorDto } from '../common/result-set-descriptor.dto';

export class GetAllExamplesResponseDto {
  @ApiProperty({
    type: () => ResultSetDescriptorDto,
  })
  resultSetDescriptor!: ResultSetDescriptorDto;

  @ApiProperty({
    description: 'Result set.',
    type: () => ExampleResponseDto,
    isArray: true,
    example: [
      {
        id: 'd78e4fd9-3a7d-4e33-a101-24e3c1df713d',
        name: 'My Example',
        description: 'Lorem ipsum',
        createdAt: '2021-12-16T13:47:06.051Z',
        modifiedAt: '2021-12-16T13:47:06.051Z',
      },
      {
        id: 'd78e4fd9-3a7d-4e33-a101-24e3c1df713e',
        name: 'My Example',
        createdAt: '2021-12-17T13:47:06.051Z',
        modifiedAt: '2021-12-18T13:47:06.051Z',
      },
    ],
  })
  resultSet!: ExampleResponseDto[];
}
