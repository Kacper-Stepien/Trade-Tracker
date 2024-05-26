import { IsString } from 'class-validator';

export class UpdateProductAttributeDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}
