export type CostType = {
  id: number;
  name: string;
  costsCount: number;
};

export type UpdateCostType = {
  id: number;
  name: string;
};

export type CostTypesResponse = {
  costTypes: CostType[];
  total: number;
};
