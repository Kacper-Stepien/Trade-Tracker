import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { ProductCostModule } from '../product-cost/product-cost.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    // TypeOrmModule.forFeature([Product, ProductCost]),
    ProductCostModule,
    ProductsModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
