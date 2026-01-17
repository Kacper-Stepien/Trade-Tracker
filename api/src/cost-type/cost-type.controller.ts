import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CostTypeService } from './cost-type.service';
import { CreateCostTypeDto } from './dtos/create-cost-type.dto';
import { UpdateCostTypeDto } from './dtos/update-cost-type.dto';
import { CostTypeDto } from './dtos/cost-type.dto';
import { AdminGuard } from '../auth2/guards/admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@Controller('cost-type')
@ApiTags('cost-type')
export class CostTypeController {
  constructor(private readonly costTypeService: CostTypeService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get cost type by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Cost type ID' })
  @ApiResponse({
    status: 200,
    description: 'The cost type with the specified ID',
    type: CostTypeDto,
  })
  @ApiResponse({ status: 404, description: 'Cost type not found' })
  getCostType(@Param('id', ParseIntPipe) id: number): Promise<CostTypeDto> {
    return this.costTypeService.getCostTypeById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cost types' })
  @ApiResponse({
    status: 200,
    description: 'An array of cost types',
    type: CostTypeDto,
    isArray: true,
  })
  getAllCostTypes(): Promise<CostTypeDto[]> {
    return this.costTypeService.getAllCostTypes();
  }

  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a cost type - only for admin' })
  @ApiBody({ type: CreateCostTypeDto })
  @ApiResponse({
    status: 201,
    description: 'The cost type has been successfully created',
    type: CostTypeDto,
  })
  @ApiResponse({ status: 409, description: 'Cost type already exists' })
  createCostType(
    @Body() createCostTypeDto: CreateCostTypeDto,
  ): Promise<CostTypeDto> {
    return this.costTypeService.createCostType(createCostTypeDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a cost type - only for admin' })
  @ApiParam({ name: 'id', type: 'number', description: 'Cost type ID' })
  @ApiBody({ type: UpdateCostTypeDto })
  @ApiResponse({
    status: 200,
    description: 'The cost type has been successfully updated',
    type: CostTypeDto,
  })
  @ApiResponse({ status: 404, description: 'Cost type not found' })
  updateCostType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCostTypeDto: UpdateCostTypeDto,
  ): Promise<CostTypeDto> {
    return this.costTypeService.updateCostType(id, updateCostTypeDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cost type - only for admin' })
  @ApiParam({ name: 'id', type: 'number', description: 'Cost type ID' })
  @ApiResponse({
    status: 204,
    description: 'The cost type has been successfully deleted',
  })
  deleteCostType(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.costTypeService.deleteCostType(id);
  }
}
