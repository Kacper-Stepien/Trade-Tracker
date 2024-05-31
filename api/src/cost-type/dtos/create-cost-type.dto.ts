import { IsString, MaxLength } from 'class-validator';

export class CreateCostTypeDto {
  @IsString()
  @MaxLength(255)
  name: string;
}
