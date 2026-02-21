import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ResultAsync } from "neverthrow";
import {
  CreateProductInput,
  GetProductsParams,
  MarkProductAsSoldInput,
  Product,
  ProductListResponse,
  UpdateProductInput,
} from "../../types/Product";
import { ApiError } from "../../types/errors";
import { axiosInstance } from "../../utils/axiosInstance";
import { toResult } from "../../utils/resultWrapper";

export const PRODUCTS_QUERY_KEY = ["products"];
export const PRODUCT_QUERY_KEY = ["product"];

export const getProductsQueryKey = (params: GetProductsParams = {}) => [
  ...PRODUCTS_QUERY_KEY,
  params.page ?? 1,
  params.limit ?? 10,
  params.sold ?? null,
  params.category ?? null,
];

const fetchProducts = async (
  params: GetProductsParams = {},
): Promise<ProductListResponse> => {
  const response = await axiosInstance.get<ProductListResponse>("/products", {
    params,
  });
  return response.data;
};

const fetchProductById = async (id: number): Promise<Product> => {
  const response = await axiosInstance.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = (
  payload: CreateProductInput,
): ResultAsync<Product, ApiError> => {
  return toResult(axiosInstance.post<Product>("/products", payload));
};

export const updateProduct = (
  payload: UpdateProductInput,
): ResultAsync<Product, ApiError> => {
  const { id, ...body } = payload;
  return toResult(axiosInstance.patch<Product>(`/products/${id}`, body));
};

export const deleteProduct = (id: number): ResultAsync<void, ApiError> => {
  return toResult(axiosInstance.delete(`/products/${id}`));
};

export const markProductAsSold = (
  payload: MarkProductAsSoldInput,
): ResultAsync<Product, ApiError> => {
  const { id, salePrice, saleDate } = payload;
  return toResult(
    axiosInstance.patch<Product>(`/products/${id}/sold`, { salePrice, saleDate }),
  );
};

export const markProductAsUnsold = (id: number): ResultAsync<Product, ApiError> => {
  return toResult(axiosInstance.patch<Product>(`/products/${id}/unsold`));
};

export const useProductsQuery = (params: GetProductsParams = {}) => {
  return useQuery({
    queryKey: getProductsQueryKey(params),
    queryFn: () => fetchProducts(params),
  });
};

export const useProductByIdQuery = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEY, id],
    queryFn: () => fetchProductById(id),
    enabled,
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductInput) => {
      const result = await createProduct(payload);
      return result;
    },
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      }
    },
    retry: false,
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProductInput) => {
      const result = await updateProduct(payload);
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, variables.id] });
      }
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteProduct(id);
      return result;
    },
    onSuccess: (result, id) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        queryClient.removeQueries({ queryKey: [...PRODUCT_QUERY_KEY, id] });
      }
    },
  });
};

export const useMarkProductAsSoldMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: MarkProductAsSoldInput) => {
      const result = await markProductAsSold(payload);
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, variables.id] });
      }
    },
  });
};

export const useMarkProductAsUnsoldMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await markProductAsUnsold(id);
      return result;
    },
    onSuccess: (result, id) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, id] });
      }
    },
  });
};
