import { IsNotEmpty, IsNumber } from 'class-validator';

export class CdkDeployVarsDto {
  @IsNotEmpty()
  @IsNumber()
  MIN_REPLICAS!: number;

  @IsNotEmpty()
  @IsNumber()
  MAX_REPLICAS!: number;

  @IsNotEmpty()
  @IsNumber()
  TARGERT_CPU_UTILIZATION_PERCENTAGE!: number;
}
