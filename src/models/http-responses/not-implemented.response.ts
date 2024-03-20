import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { HttpStatusCode } from 'src/types/enums';

export class NotImplementedResponse {
  @IsNumber()
  @ApiProperty({
    example: HttpStatusCode.NOT_IMPLEMENTED,
  })
  statusCode!: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: 'Requested functionality is not yet implemented',
    deprecated: true,
  })
  message!: string[];

  @IsString()
  @ApiProperty({
    example: 'Not implemented',
  })
  error!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Requested functionality is not yet implemented'],
  })
  messages!: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['NOT_IMPLEMENTED'],
  })
  errorCodes!: string[];
}
