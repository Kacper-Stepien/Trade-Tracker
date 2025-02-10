import { ApiProperty } from '@nestjs/swagger';

export class ProductStatisticDto {
  @ApiProperty({
    description: 'Unique identifier of the product.',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Purchase price of the product.',
    example: 500.0,
  })
  purchasePrice: number;

  @ApiProperty({
    description: 'Date when the product was purchased.',
    example: '2025-01-15T00:00:00.000Z',
  })
  purchaseDate: Date;

  @ApiProperty({
    description: 'Indicates whether the product has been sold.',
    example: true,
  })
  sold: boolean;

  @ApiProperty({
    description: 'Sale price of the product, if sold.',
    example: 750.0,
    nullable: true,
  })
  salePrice: number | null;

  @ApiProperty({
    description: 'Date when the product was sold, if applicable.',
    example: '2025-02-20T00:00:00.000Z',
    nullable: true,
  })
  saleDate: Date | null;

  @ApiProperty({
    description: 'Total additional costs associated with the product.',
    example: 50.0,
  })
  costs: number;

  @ApiProperty({
    description: 'Total revenue generated from the product.',
    example: 800.0,
    nullable: true,
  })
  revenue: number | null;

  @ApiProperty({
    description: 'Net profit earned from the product.',
    example: 250.0,
  })
  profit: number;

  @ApiProperty({
    description: 'Profit percentage relative to the purchase price.',
    example: 50.0,
    nullable: true,
  })
  profitPercentage: number | null;
}
