import { IsDateString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaleProductDto {
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({ example: 1299.99, description: 'Sale price' })
  salePrice: number;

  @IsDateString()
  @ApiProperty({ example: '2024-02-20', description: 'Sale date' })
  saleDate: Date;
}
