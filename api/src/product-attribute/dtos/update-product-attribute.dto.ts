import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductAttributeDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the product attribute',
    example: 'Color',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'The value of the product attribute',
    example: 'Red',
  })
  value: string;
}
