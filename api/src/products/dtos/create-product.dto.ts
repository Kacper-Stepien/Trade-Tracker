import {
  IsNumber,
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AttributeDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
  purchasePrice: number;

  @IsDateString()
  purchaseDate: Date;

  @IsNumber()
  categoryId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes: AttributeDto[];
}
