import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { HttpStatusCode } from 'src/types/enums';

export class UnprocessableEntityResponse {
  @IsNumber()
  @ApiProperty({
    example: HttpStatusCode.UNPROCESSABLE_ENTITY,
  })
  statusCode!: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: 'Could not process entity',
    deprecated: true,
  })
  message!: string[];

  @IsString()
  @ApiProperty({
    example: 'Unprocessable entity',
  })
  error!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Could not process entity'],
  })
  messages!: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['UNPROCESSABLE_ENTITY'],
  })
  errorCodes!: string[];
}
