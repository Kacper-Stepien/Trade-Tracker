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
import { Logger } from '@kacper2076/logger-client';

@Injectable()
export class CostTypeService {
  private readonly logger = new Logger(CostTypeService.name);

  constructor(
    @InjectRepository(CostType)
    private costTypeRepository: Repository<CostType>,
  ) {}

  async getCostTypeById(id: number): Promise<CostTypeDto> {
    const costType = await this.costTypeRepository.findOneBy({ id });
    if (!costType) {
      this.logger.warn('Cost type not found', { costTypeId: id });
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
    const { name } = createCostTypeDto;
    this.logger.info('Creating cost type', { name });

    await this.checkCostTypeExistence(name);
    const costType = this.costTypeRepository.create(createCostTypeDto);
    const savedCostType = await this.costTypeRepository.save(costType);

    this.logger.info('Cost type created successfully', {
      costTypeId: savedCostType.id,
      name,
    });
    return CostTypeMapper.toDto(savedCostType);
  }

  async updateCostType(
    id: number,
    updateCostTypeDto: UpdateCostTypeDto,
  ): Promise<CostTypeDto> {
    const { name } = updateCostTypeDto;
    this.logger.info('Updating cost type', { costTypeId: id, name });

    const costType = await this.costTypeRepository.findOneBy({ id });
    if (!costType) {
      this.logger.warn('Cost type not found for update', { costTypeId: id });
      throw new NotFoundException(`Cost type with ID ${id} not found`);
    }

    costType.name = name;
    const savedCostType = await this.costTypeRepository.save(costType);

    this.logger.info('Cost type updated successfully', { costTypeId: id });
    return CostTypeMapper.toDto(savedCostType);
  }

  async deleteCostType(id: number): Promise<void> {
    this.logger.info('Deleting cost type', { costTypeId: id });

    const result = await this.costTypeRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn('Cost type not found for deletion', { costTypeId: id });
      throw new NotFoundException(`Cost type with ID ${id} not found`);
    }

    this.logger.info('Cost type deleted successfully', { costTypeId: id });
  }

  private async checkCostTypeExistence(name: string): Promise<void> {
    const costType = await this.costTypeRepository.findOneBy({ name });
    if (costType) {
      this.logger.warn('Cost type with this name already exists', { name });
      throw new ConflictException(`Cost type with name ${name} already exists`);
    }
  }
}
