export class ProductStatisticDto {
  id: number;
  purchasePrice: number;
  purchaseDate: Date;
  sold: boolean;
  salePrice: number | null;
  saleDate: Date | null;
  costs: number;
  revenue: number | null;
  profit: number;
  profitPercentage: number | null;
}
