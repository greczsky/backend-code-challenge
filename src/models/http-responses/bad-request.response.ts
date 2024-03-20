import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { HttpStatusCode } from 'src/types/enums';

export class BadRequestResponse {
  @IsNumber()
  @ApiProperty({
    example: HttpStatusCode.BAD_REQUEST,
  })
  statusCode!: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Validation failed'],
    deprecated: true,
  })
  message!: string[];

  @IsString()
  @ApiProperty({
    example: 'Bad Request',
  })
  error!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Validation error for the input field'],
  })
  messages!: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['MISSING_FIELD'],
  })
  errorCodes!: string[];
}
