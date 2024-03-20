import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

import { Environment } from 'src/types/enums';

import { ToBoolean } from '../helpers/env-validation.helper';

export class EnvironmentVarsDto {
  @IsNotEmpty()
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  PORT!: number;

  @IsNotEmpty()
  @IsString()
  LOG_LEVEL!: 'info' | 'warn' | 'error' | 'debug';

  @IsNotEmpty()
  @IsString()
  LOG_CONTEXT!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  CDK_FEATURE_SLUG?: string;

  @ValidateIf((o: EnvironmentVarsDto) => o.NODE_ENV === Environment.Production)
  @IsNotEmpty()
  @IsString()
  AWS_REGION!: string;

  @ValidateIf((o: EnvironmentVarsDto) => o.NODE_ENV === Environment.Production)
  @IsNotEmpty()
  @IsString()
  AWS_SECRETMANAGER_RDS_CONNECTION!: string;

  @ValidateIf((o: EnvironmentVarsDto) => o.NODE_ENV === Environment.Development)
  @IsNotEmpty()
  @IsString()
  TYPEORM_URL!: string;

  @IsNotEmpty()
  @IsBoolean()
  @ToBoolean()
  TYPEORM_MIGRATIONS_RUN!: boolean;

  @ValidateIf((o: EnvironmentVarsDto) => o.TYPEORM_MIGRATIONS_RUN === true)
  @IsNotEmpty()
  @IsString()
  TYPEORM_MIGRATIONS!: string;

  @IsNotEmpty()
  @IsBoolean()
  @ToBoolean()
  TYPEORM_LOGGING!: boolean;

  @IsString()
  EXAMPLE_ENV_VARIABLE!: string;
}
