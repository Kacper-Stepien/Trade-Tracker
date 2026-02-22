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
  costType?: {
    id: number;
    name: string;
  };
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

export const PRODUCT_SOLD_FILTER = {
  ALL: "all",
  SOLD: "sold",
  UNSOLD: "unsold",
} as const;

export type ProductSoldFilter =
  (typeof PRODUCT_SOLD_FILTER)[keyof typeof PRODUCT_SOLD_FILTER];

export const PRODUCT_CATEGORY_FILTER_ALL = "all";

export type ProductCategoryFilter =
  | typeof PRODUCT_CATEGORY_FILTER_ALL
  | `${number}`;

export type CreateProductAttributeItemInput = {
  name: string;
  value: string;
};

export type CreateProductInput = {
  name: string;
  purchasePrice: number;
  purchaseDate: string;
  categoryId: number;
  attributes?: CreateProductAttributeItemInput[];
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

export type CreateProductCostInput = {
  name: string;
  description: string;
  price: number;
  date: string;
  productId: number;
  costTypeId: number;
};

export type UpdateProductCostInput = {
  id: number;
  productId: number;
  name?: string;
  description?: string;
  price?: number;
  date?: string;
};

export type DeleteProductCostInput = {
  id: number;
  productId: number;
};

export type CreateProductAttributeMutationInput = {
  productId: number;
  name: string;
  value: string;
};

export type UpdateProductAttributeInput = {
  productId: number;
  attributeId: number;
  name: string;
  value: string;
};

export type DeleteProductAttributeInput = {
  productId: number;
  attributeId: number;
};
