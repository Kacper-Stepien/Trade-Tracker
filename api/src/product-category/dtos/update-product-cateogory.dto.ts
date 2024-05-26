import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
