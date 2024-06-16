import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the product cost',
    example: 'Repair bumper',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Description of the product cost',
    example: 'Repair the bumper on the car, including paint and labor.',
  })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Price of the product cost',
    example: 100.0,
  })
  price: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Date of the product cost',
    example: '2021-09-01T00:00:00.000Z',
  })
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Product ID of the product cost',
    example: 1,
  })
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Cost type ID of the product cost type',
    example: 1,
  })
  costTypeId: number;
}
