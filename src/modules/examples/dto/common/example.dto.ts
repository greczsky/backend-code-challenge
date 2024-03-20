import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';

export class ExampleDto {
  @IsString()
  @ApiProperty({
    description: 'ID of the example.',
    example: 'd78e4fd9-3a7d-4e33-a101-24e3c1df713d',
  })
  id!: string;

  @IsString()
  @MaxLength(256)
  @ApiProperty({
    description: 'Name of the example.',
    example: 'My example',
    maxLength: 256,
  })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Example description.',
    example: 'Lorem ipsum.',
  })
  description?: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Example creation timestamp.',
    format: 'date',
    example: '2021-12-16T13:47:06.051Z',
  })
  createdAt!: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'Example modification timestamp.',
    format: 'date',
    example: '2021-12-16T13:47:06.051Z',
  })
  modifiedAt!: Date;
}
