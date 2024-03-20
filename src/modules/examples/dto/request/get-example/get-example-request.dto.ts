import { PickType } from '@nestjs/swagger';

import { ExampleDto } from '../../common/example.dto';

export class GetExampleRequestDto extends PickType(ExampleDto, ['id']) {}
