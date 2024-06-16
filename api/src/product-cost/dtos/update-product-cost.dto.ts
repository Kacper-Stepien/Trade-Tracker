import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsPositive,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductCostDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Name of the product cost',
    example: 'Repair bumper',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Description of the product cost',
    example: 'Repair the bumper on the car, including paint and labor.',
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiPropertyOptional({
    description: 'Price of the product cost',
    example: 100.0,
  })
  price?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    description: 'Date of the product cost',
    example: '2021-09-01T00:00:00.000Z',
  })
  date?: Date;
}
