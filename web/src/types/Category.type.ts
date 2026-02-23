export type Category = {
  id: number;
  name: string;
  productsCount: number;
};

export type CategoriesResponse = {
  categories: Category[];
  total: number;
};
