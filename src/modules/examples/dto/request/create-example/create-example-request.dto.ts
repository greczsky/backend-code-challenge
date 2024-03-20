import { PickType } from '@nestjs/swagger';

import { ExampleDto } from '../../common/example.dto';

export class CreateExampleRequestDto extends PickType(ExampleDto, ['name', 'description']) {}
