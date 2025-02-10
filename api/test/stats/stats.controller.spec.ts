import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from '../../src/stats/stats.controller';
import { StatsService } from '../../src/stats/stats.service';
import { statsServiceMock } from './stats.service.mock';

describe('StatsController', () => {
  let controller: StatsController;
  let service: StatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: statsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
