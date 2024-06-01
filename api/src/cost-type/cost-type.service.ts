import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCostTypeDto } from './dtos/create-cost-type.dto';
import { Repository } from 'typeorm';
import { CostType } from './cost-type.entity';
import { UpdateCostTypeDto } from './dtos/update-cost-type.dto';
import { CostTypeDto } from './dtos/cost-type.dto';
import { CostTypeMapper } from './cost-type.mapper';

@Injectable()
export class CostTypeService {
  constructor(
    @InjectRepository(CostType)
    private costTypeRepository: Repository<CostType>,
  ) {}

  async getCostTypeById(id: number): Promise<CostTypeDto> {
    const costType = await this.costTypeRepository.findOneBy({ id });
    if (!costType) {
      throw new NotFoundException(`Cost type with ID ${id} not found`);
    }
    return CostTypeMapper.toDto(costType);
  }

  async getAllCostTypes(): Promise<CostTypeDto[]> {
    const costTypes = await this.costTypeRepository.find();
    return costTypes.map((costType) => CostTypeMapper.toDto(costType));
  }

  async createCostType(
    createCostTypeDto: CreateCostTypeDto,
  ): Promise<CostTypeDto> {
    await this.checkCostTypeExistance(createCostTypeDto.name);
    const costType = this.costTypeRepository.create(createCostTypeDto);
    return CostTypeMapper.toDto(await this.costTypeRepository.save(costType));
  }

  async updateCostType(
    id: number,
    updateCostTypeDto: UpdateCostTypeDto,
  ): Promise<CostTypeDto> {
    const costType = await this.getCostTypeById(id);
    costType.name = updateCostTypeDto.name;
    return CostTypeMapper.toDto(await this.costTypeRepository.save(costType));
  }

  async deleteCostType(id: number): Promise<void> {
    const result = await this.costTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cost type with ID ${id} not found`);
    }
  }

  private async checkCostTypeExistance(name: string): Promise<void> {
    const costType = await this.costTypeRepository.findOneBy({ name });
    if (costType) {
      throw new ConflictException(`Cost type with name ${name} already exists`);
    }
  }
}
