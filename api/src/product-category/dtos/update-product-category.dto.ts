import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Electronics',
    description: 'Updated name of the product category',
  })
  name: string;
}
