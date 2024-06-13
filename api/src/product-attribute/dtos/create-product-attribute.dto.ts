import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttributeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the product attribute',
    example: 'Color',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The value of the product attribute',
    example: 'Red',
  })
  value: string;
}
