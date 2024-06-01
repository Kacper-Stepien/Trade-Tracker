import { CostType } from './cost-type.entity';
import { CostTypeDto } from './dtos/cost-type.dto';

export class CostTypeMapper {
  static toDto(costType: CostType) {
    const costTypeDto: CostTypeDto = {
      id: costType.id,
      name: costType.name,
    };
    return costTypeDto;
  }
}
