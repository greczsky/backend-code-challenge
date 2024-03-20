import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { HttpStatusCode } from 'src/types/enums';

export class InternalServerErrorResponse {
  @IsNumber()
  @ApiProperty({
    example: HttpStatusCode.INTERNAL_SERVER_ERROR,
  })
  statusCode!: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: 'Correlation ID: 40ef14eb-6b02-4369-bd4b-1b84637ecb44',
    deprecated: true,
  })
  message!: string[];

  @IsString()
  @ApiProperty({
    example: 'Internal server error',
  })
  error!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Correlation ID: 40ef14eb-6b02-4369-bd4b-1b84637ecb44'],
  })
  messages!: string[];
}
