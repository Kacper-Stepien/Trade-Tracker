import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
  IsInt,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'iPhone 15 Pro', description: 'Product name' })
  name?: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiPropertyOptional({ example: 1099.99, description: 'Purchase price' })
  purchasePrice?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: '2024-01-20', description: 'Purchase date' })
  purchaseDate?: Date;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiPropertyOptional({ example: 2, description: 'Category ID' })
  categoryId?: number;
}
