import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { HttpStatusCode } from 'src/types/enums';

export class UnsupportedMediaTypeResponse {
  @IsNumber()
  @ApiProperty({
    example: HttpStatusCode.UNSUPPORTED_MEDIA_TYPE,
  })
  statusCode!: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: 'Media type is not supported',
    deprecated: true,
  })
  message!: string[];

  @IsString()
  @ApiProperty({
    example: 'Unsupported media type',
  })
  error!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Media type is not supported'],
  })
  messages!: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['UNSUPPORTED_MEDIA_TYPE'],
  })
  errorCodes!: string[];
}
