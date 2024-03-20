import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { HttpStatusCode } from 'src/types/enums';

export class ConflictResponse {
  @IsNumber()
  @ApiProperty({
    example: HttpStatusCode.CONFLICT,
  })
  statusCode!: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: 'Entity already exists',
    deprecated: true,
  })
  message!: string[];

  @IsString()
  @ApiProperty({
    example: 'Conflict',
  })
  error!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Entity already exists'],
  })
  messages!: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['ENTITY_ALREADY_EXISTS'],
  })
  errorCodes!: string[];
}
