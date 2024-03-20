import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { HttpStatusCode } from 'src/types/enums';

export class ForbiddenResponse {
  @IsNumber()
  @ApiProperty({
    example: HttpStatusCode.FORBIDDEN,
  })
  statusCode!: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: "You don't have permission to access this resource",
    deprecated: true,
  })
  message!: string[];

  @IsString()
  @ApiProperty({
    example: 'Forbidden',
  })
  error!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ["You don't have permission to access this resource"],
  })
  messages!: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['FORBIDDEN'],
  })
  errorCodes!: string[];
}
