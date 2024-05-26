import { IsString } from 'class-validator';

export class CreateProductAttributeDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}
