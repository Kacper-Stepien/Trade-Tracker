import { ApiProperty } from '@nestjs/swagger';
import { CostTypeDto } from './cost-type.dto';

export class GetCostTypesResponseDto {
  @ApiProperty({
    type: [CostTypeDto],
    description: 'Paginated list of cost types',
  })
  costTypes: CostTypeDto[];

  @ApiProperty({
    example: 20,
    description: 'Total number of cost types',
  })
  total: number;
}
