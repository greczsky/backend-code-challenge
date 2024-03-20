import { IsNotEmpty, IsString } from 'class-validator';

export class CdkOutputsDto {
  @IsNotEmpty()
  @IsString()
  IAMRoleARN!: string;

  @IsNotEmpty()
  @IsString()
  RDSSecretARN!: string;

  @IsNotEmpty()
  @IsString()
  RDSSecretName!: string;
}
