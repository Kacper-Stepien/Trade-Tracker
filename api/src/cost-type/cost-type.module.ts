import { Module, forwardRef } from '@nestjs/common';
import { CostTypeController } from './cost-type.controller';
import { CostTypeService } from './cost-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostType } from './cost-type.entity';
import { ProductCostModule } from 'src/product-cost/product-cost.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CostType]),
    forwardRef(() => ProductCostModule),
  ],
  controllers: [CostTypeController],
  providers: [CostTypeService],
})
export class CostTypeModule {}
