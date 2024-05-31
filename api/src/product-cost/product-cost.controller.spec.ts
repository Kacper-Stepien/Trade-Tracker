import { Test, TestingModule } from '@nestjs/testing';
import { ProductCostController } from './product-cost.controller';

describe('ProductCostController', () => {
  let controller: ProductCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCostController],
    }).compile();

    controller = module.get<ProductCostController>(ProductCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
