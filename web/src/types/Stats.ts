export const STATS_RANGE = {
  ALL: "all",
  LAST_3_MONTHS: "3m",
  LAST_6_MONTHS: "6m",
  LAST_12_MONTHS: "12m",
} as const;

export type StatsRange = (typeof STATS_RANGE)[keyof typeof STATS_RANGE];

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

export type ProfitByCategory = {
  category: string;
  profit: number;
  sharePercentage: number;
};

export type ProfitTrendPoint = {
  period: string;
  profit: number;
};

export type StatsCharts = {
  aggregation: "month" | "year";
  profitByCategory: ProfitByCategory[];
  profitTrend: ProfitTrendPoint[];
};
