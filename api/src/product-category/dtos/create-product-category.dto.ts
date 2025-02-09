import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Electronics',
    description: 'The name of the product category',
  })
  name: string;
}
