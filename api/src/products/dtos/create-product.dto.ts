import {
  IsNumber,
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsPositive,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AttributeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Color', description: 'Attribute name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Red', description: 'Attribute value' })
  value: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'iPhone 15', description: 'Product name' })
  name: string;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @IsPositive()
  @ApiProperty({ example: 999.99, description: 'Purchase price' })
  purchasePrice: number;

  @IsDateString()
  @ApiProperty({ example: '2024-01-15', description: 'Purchase date' })
  purchaseDate: Date;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: 'Category ID' })
  categoryId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  @ApiPropertyOptional({
    type: [AttributeDto],
    description: 'Product attributes',
  })
  attributes?: AttributeDto[];
}
