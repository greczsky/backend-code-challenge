import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { HttpStatusCode } from 'src/types/enums';

export class PayloadTooLargeResponse {
  @IsNumber()
  @ApiProperty({
    example: HttpStatusCode.PAYLOAD_TOO_LARGE,
  })
  statusCode!: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: 'Max payload size exceeded',
    deprecated: true,
  })
  message!: string[];

  @IsString()
  @ApiProperty({
    example: 'Payload too large',
  })
  error!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Max payload size exceeded'],
  })
  messages!: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['PAYLOAD_TOO_LARGE'],
  })
  errorCodes!: string[];
}
