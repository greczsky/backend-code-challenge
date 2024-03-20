import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { HttpStatusCode } from 'src/types/enums';

export class UnauthorizedResponse {
  @IsNumber()
  @ApiProperty({
    example: HttpStatusCode.UNAUTHORIZED,
  })
  statusCode!: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: 'Invalid credentials',
    deprecated: true,
  })
  message!: string[];

  @IsString()
  @ApiProperty({
    example: 'Unauthorized',
  })
  error!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['Invalid credentials'],
  })
  messages!: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['INVALID_CREDENTIALS'],
  })
  errorCodes!: string[];
}
