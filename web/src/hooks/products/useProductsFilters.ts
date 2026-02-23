import { SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import {
  PRODUCT_CATEGORY_FILTER_ALL,
  PRODUCT_SOLD_FILTER,
  ProductCategoryFilter,
  ProductSoldFilter,
} from "../../types/Product";

const isProductSoldFilter = (value: string): value is ProductSoldFilter => {
  return Object.values(PRODUCT_SOLD_FILTER).includes(value as ProductSoldFilter);
};

export const useProductsFilters = (onFiltersChange?: () => void) => {
  const [soldFilter, setSoldFilter] = useState<ProductSoldFilter>(
    PRODUCT_SOLD_FILTER.ALL,
  );
  const [categoryFilter, setCategoryFilter] = useState<ProductCategoryFilter>(
    PRODUCT_CATEGORY_FILTER_ALL,
  );

  const handleSoldFilterChange = (event: SelectChangeEvent) => {
    const nextValue = event.target.value;
    if (!isProductSoldFilter(nextValue)) {
      return;
    }

    setSoldFilter(nextValue);
    onFiltersChange?.();
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    const nextValue = event.target.value;
    if (
      nextValue !== PRODUCT_CATEGORY_FILTER_ALL &&
      !/^\d+$/.test(nextValue)
    ) {
      return;
    }

    setCategoryFilter(nextValue as ProductCategoryFilter);
    onFiltersChange?.();
  };

  const soldParam =
    soldFilter === PRODUCT_SOLD_FILTER.ALL
      ? undefined
      : soldFilter === PRODUCT_SOLD_FILTER.SOLD;

  const categoryParam =
    categoryFilter === PRODUCT_CATEGORY_FILTER_ALL
      ? undefined
      : Number(categoryFilter);

  return {
    soldFilter,
    categoryFilter,
    soldParam,
    categoryParam,
    handleSoldFilterChange,
    handleCategoryFilterChange,
  };
};
