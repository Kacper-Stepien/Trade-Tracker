import { IsOptional } from 'class-validator';

export class UpdateProductCostDto {
  @IsOptional()
  name?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  price?: number;
  @IsOptional()
  date?: Date;
}
