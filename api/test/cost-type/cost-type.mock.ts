import { CostTypeDto } from 'src/cost-type/dtos/cost-type.dto';
import { CostType } from '../../src/cost-type/cost-type.entity';
import { CostTypeMapper } from '../../src/cost-type/cost-type.mapper';

export const mockCostTypes: CostType[] = [
  {
    id: 1,
    name: 'Test Cost Type',
    costs: [],
  },
  {
    id: 2,
    name: 'Another Test Cost Type',
    costs: [],
  },
  {
    id: 3,
    name: 'Yet Another Test Cost Type',
    costs: [],
  },
];

export const mockCostTypesDto: CostTypeDto[] =
  CostTypeMapper.toDtoList(mockCostTypes);
