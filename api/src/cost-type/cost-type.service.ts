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
import { ProductCost } from 'src/product-cost/product-cost.entity';
import { ApiErrorCode } from 'src/common/constants/error-codes';

@Injectable()
export class CostTypeService {
  private readonly logger = new Logger(CostTypeService.name);

  constructor(
    @InjectRepository(CostType)
    private costTypeRepository: Repository<CostType>,
    @InjectRepository(ProductCost)
    private readonly productCostRepository: Repository<ProductCost>,
  ) {}

  async getCostTypeById(id: number): Promise<CostTypeDto> {
    const costType = await this.costTypeRepository
      .createQueryBuilder('costType')
      .where('costType.id = :id', { id })
      .loadRelationCountAndMap('costType.costsCount', 'costType.costs')
      .getOne();
    if (!costType) {
      this.logger.warn('Cost type not found', { costTypeId: id });
      throw new NotFoundException({
        message: `Cost type with ID ${id} not found`,
        code: ApiErrorCode.COST_TYPE_NOT_FOUND,
      });
    }
    return CostTypeMapper.toDto(costType);
  }

  async getAllCostTypes(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ costTypes: CostTypeDto[]; total: number }> {
    const query = this.costTypeRepository
      .createQueryBuilder('costType')
      .loadRelationCountAndMap('costType.costsCount', 'costType.costs')
      .orderBy('costType.id', 'DESC');

    query.skip((page - 1) * limit).take(limit);

    const [costTypes, total] = await query.getManyAndCount();

    return { costTypes: CostTypeMapper.toDtoList(costTypes), total };
  }

  async getAllCostTypesList(): Promise<CostTypeDto[]> {
    const costTypes = await this.costTypeRepository.find({
      order: { id: 'DESC' },
    });

    return CostTypeMapper.toDtoList(costTypes);
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
      throw new NotFoundException({
        message: `Cost type with ID ${id} not found`,
        code: ApiErrorCode.COST_TYPE_NOT_FOUND,
      });
    }

    costType.name = name;
    const savedCostType = await this.costTypeRepository.save(costType);

    this.logger.info('Cost type updated successfully', { costTypeId: id });
    return CostTypeMapper.toDto(savedCostType);
  }

  async deleteCostType(id: number): Promise<void> {
    this.logger.info('Deleting cost type', { costTypeId: id });
    const associatedCosts = await this.productCostRepository.countBy({
      costType: { id },
    });
    if (associatedCosts > 0) {
      this.logger.warn(
        'Cannot delete cost type with associated product costs',
        {
          costTypeId: id,
          associatedCosts,
        },
      );
      throw new ConflictException({
        message: 'Cannot delete cost type with associated product costs',
        code: ApiErrorCode.COST_TYPE_HAS_ASSOCIATED_COSTS,
      });
    }

    const result = await this.costTypeRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn('Cost type not found for deletion', { costTypeId: id });
      throw new NotFoundException({
        message: `Cost type with ID ${id} not found`,
        code: ApiErrorCode.COST_TYPE_NOT_FOUND,
      });
    }

    this.logger.info('Cost type deleted successfully', { costTypeId: id });
  }

  private async checkCostTypeExistence(name: string): Promise<void> {
    const costType = await this.costTypeRepository.findOneBy({ name });
    if (costType) {
      this.logger.warn('Cost type with this name already exists', { name });
      throw new ConflictException({
        message: `Cost type with name "${name}" already exists`,
        code: ApiErrorCode.COST_TYPE_ALREADY_EXISTS,
      });
    }
  }
}
