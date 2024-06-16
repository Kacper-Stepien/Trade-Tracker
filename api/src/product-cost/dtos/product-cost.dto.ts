import { CostType } from 'src/cost-type/cost-type.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ProductCostDto {
  @ApiProperty({
    description: 'ID of the product cost',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the product cost',
    example: 'Repair bumper',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the product cost',
    example: 'Repair the bumper on the car, including paint and labor.',
  })
  description: string;

  @ApiProperty({
    description: 'Price of the product cost',
    example: 100.0,
  })
  price: number;

  @ApiProperty({
    description: 'Date of the product cost',
    example: '2021-09-0',
  })
  date: Date;

  @ApiProperty({
    description: 'Cost type of the product cost',
    type: () => CostType,
  })
  costType: CostType;
}
