import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CostTypeService } from './cost-type.service';
import { CreateCostTypeDto } from './dtos/create-cost-type.dto';
import { UpdateCostTypeDto } from './dtos/update-cost-type.dto';
import { CostTypeDto } from './dtos/cost-type.dto';
import { AdminGuard } from '../auth/admin.guard';

@Controller('cost-type')
export class CostTypeController {
  constructor(private readonly costTypeService: CostTypeService) {}

  @Get('id')
  getCostType(@Param('id') id: number): Promise<CostTypeDto> {
    return this.costTypeService.getCostTypeById(id);
  }

  @Get()
  getAllCostTypes(): Promise<CostTypeDto[]> {
    return this.costTypeService.getAllCostTypes();
  }

  @UseGuards(AdminGuard)
  @Post()
  createCostType(
    @Body() createCostTypeDto: CreateCostTypeDto,
  ): Promise<CostTypeDto> {
    return this.costTypeService.createCostType(createCostTypeDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  updateCostType(
    @Param('id') id: number,
    @Body() updateCostTypeDto: UpdateCostTypeDto,
  ): Promise<CostTypeDto> {
    return this.costTypeService.updateCostType(id, updateCostTypeDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteCostType(@Param('id') id: number): Promise<void> {
    return this.costTypeService.deleteCostType(id);
  }
}
