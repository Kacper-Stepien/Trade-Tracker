import { Test, TestingModule } from '@nestjs/testing';
import { ProductCostService } from './product-cost.service';

describe('ProductCostService', () => {
  let service: ProductCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCostService],
    }).compile();

    service = module.get<ProductCostService>(ProductCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
