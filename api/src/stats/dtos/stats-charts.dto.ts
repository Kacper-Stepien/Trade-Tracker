import { ApiProperty } from '@nestjs/swagger';

export class ProfitByCategoryDto {
  @ApiProperty({
    description: 'Category name.',
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({
    description: 'Net profit generated in the category.',
    example: 1240.5,
  })
  profit: number;

  @ApiProperty({
    description: 'Share of category profit in total positive profit (%).',
    example: 48.2,
  })
  sharePercentage: number;
}

export class ProfitTrendPointDto {
  @ApiProperty({
    description: 'Period label (YYYY-MM for monthly or YYYY for yearly).',
    example: '2026-02',
  })
  period: string;

  @ApiProperty({
    description: 'Net profit for the period.',
    example: 320.75,
  })
  profit: number;
}

export class StatsChartsDto {
  @ApiProperty({
    description: 'Aggregation level used for profit trend.',
    example: 'month',
    enum: ['month', 'year'],
  })
  aggregation: 'month' | 'year';

  @ApiProperty({
    description: 'Profit split by category.',
    type: [ProfitByCategoryDto],
  })
  profitByCategory: ProfitByCategoryDto[];

  @ApiProperty({
    description: 'Profit trend grouped by period.',
    type: [ProfitTrendPointDto],
  })
  profitTrend: ProfitTrendPointDto[];
}

