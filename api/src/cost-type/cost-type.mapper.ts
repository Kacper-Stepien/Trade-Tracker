import { CostType } from './cost-type.entity';
import { CostTypeDto } from './dtos/cost-type.dto';

export class CostTypeMapper {
  static toDto(costType: CostType & { costsCount?: number }): CostTypeDto {
    const costTypeDto: CostTypeDto = {
      id: costType.id,
      name: costType.name,
      costsCount: costType.costsCount ?? 0,
    };
    return costTypeDto;
  }
  static toDtoList(
    costTypes: (CostType & { costsCount?: number })[],
  ): CostTypeDto[] {
    return costTypes.map((costType) => this.toDto(costType));
  }
}
