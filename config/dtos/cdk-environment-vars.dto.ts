import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { ToBoolean } from '../helpers/env-validation.helper';

export class CdkEnvironmentVarsDto {
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  GITLAB_CI?: boolean;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((envs: CdkEnvironmentVarsDto) => !!envs.GITLAB_CI)
  CDK_DEFAULT_ACCOUNT?: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((envs: CdkEnvironmentVarsDto) => !!envs.GITLAB_CI)
  CDK_DEFAULT_REGION?: string;

  @IsNotEmpty()
  @IsString()
  CI_PROJECT_NAME!: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((envs: CdkEnvironmentVarsDto) => !!envs.GITLAB_CI)
  CI_PROJECT_URL?: string;

  @IsNotEmpty()
  @IsString()
  CI_ENVIRONMENT_NAME_BASE!: string;

  @IsNotEmpty()
  @IsString()
  CI_COMMIT_REF_SLUG!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  CDK_FEATURE_SLUG?: string;

  @IsNotEmpty()
  @IsString()
  CI_REGISTRY_IMAGE!: string;

  @IsNotEmpty()
  @IsString()
  CI_COMMIT_SHORT_SHA!: string;

  @IsNotEmpty()
  @IsString()
  STACK_ID!: string;
}
