import { PickType } from '@nestjs/swagger';

import { ExampleDto } from '../../common/example.dto';

export class ExampleResponseDto extends PickType(ExampleDto, [
  'id',
  'name',
  'description',
  'createdAt',
  'modifiedAt',
]) {}
