import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributeController } from './product-attribute.controller';
import { ProductAttributeService } from './product-attribute.service';

describe('ProductAttributeController', () => {
  let controller: ProductAttributeController;
  // eslint-disable-next-line
  let service: ProductAttributeService;

  const mockProductAttributeService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAttributeController],
      providers: [
        {
          provide: ProductAttributeService,
          useValue: mockProductAttributeService,
        },
      ],
    }).compile();

    controller = module.get<ProductAttributeController>(
      ProductAttributeController,
    );
    service = module.get<ProductAttributeService>(ProductAttributeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
