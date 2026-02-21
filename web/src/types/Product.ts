export type ProductAttribute = {
  id: number;
  name: string;
  value: string;
};

export type ProductCost = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  date: string;
};

export type ProductCategory = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  purchasePrice: number;
  purchaseDate: string;
  sold: boolean;
  salePrice: number | null;
  saleDate: string | null;
  category: ProductCategory | null;
  attributes: ProductAttribute[];
  costs: ProductCost[];
};

export type ProductListResponse = {
  products: Product[];
  total: number;
};

export type GetProductsParams = {
  page?: number;
  limit?: number;
  sold?: boolean;
  category?: number;
};

export type CreateProductAttributeInput = {
  name: string;
  value: string;
};

export type CreateProductInput = {
  name: string;
  purchasePrice: number;
  purchaseDate: string;
  categoryId: number;
  attributes?: CreateProductAttributeInput[];
};

export type UpdateProductInput = {
  id: number;
  name?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  categoryId?: number;
};

export type MarkProductAsSoldInput = {
  id: number;
  salePrice: number;
  saleDate: string;
};
