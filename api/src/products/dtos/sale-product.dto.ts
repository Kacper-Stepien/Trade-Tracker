import { IsDateString, IsNumber } from 'class-validator';

export class SaleProductDto {
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  salePrice: number;
  @IsDateString()
  saleDate: Date;
}
