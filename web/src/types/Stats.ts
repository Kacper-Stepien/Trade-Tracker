export type UserStats = {
  totalCosts: number;
  totalRevenue: number;
  totalProfit: number;
  totalProfitPercentage: number | null;
  soldProductsCosts: number;
  soldProductsRevenue: number;
  soldProductsProfit: number;
  soldProductsProfitPercentage: number | null;
  numberOfProducts: number;
  numberOfSoldProducts: number;
  averageDaysFromPurchaseToSale: number | null;
  period: string;
};
