import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ResultAsync } from "neverthrow";
import { axiosInstance } from "../../utils/axiosInstance";
import { ApiError } from "../../types/errors";
import { toResult } from "../../utils/resultWrapper";
import {
  CreateProductCostInput,
  DeleteProductCostInput,
  ProductCost,
  UpdateProductCostInput,
} from "../../types/Product";
import { PRODUCT_QUERY_KEY } from "../products";

export const PRODUCT_COSTS_QUERY_KEY = ["product_costs"];

export const getProductCostsQueryKey = (productId: number) => [
  ...PRODUCT_COSTS_QUERY_KEY,
  productId,
];

const fetchProductCosts = async (productId: number): Promise<ProductCost[]> => {
  const response = await axiosInstance.get<ProductCost[]>(
    `/product-cost/product/${productId}`,
  );
  return response.data;
};

export const createProductCost = (
  payload: CreateProductCostInput,
): ResultAsync<ProductCost, ApiError> => {
  return toResult(axiosInstance.post<ProductCost>("/product-cost", payload));
};

export const updateProductCost = (
  payload: UpdateProductCostInput,
): ResultAsync<ProductCost, ApiError> => {
  const { id, productId: _productId, ...body } = payload;
  return toResult(axiosInstance.patch<ProductCost>(`/product-cost/${id}`, body));
};

export const deleteProductCost = ({
  id,
}: DeleteProductCostInput): ResultAsync<void, ApiError> => {
  return toResult(axiosInstance.delete(`/product-cost/${id}`));
};

export const useProductCostsQuery = (productId: number, enabled = true) => {
  return useQuery({
    queryKey: getProductCostsQueryKey(productId),
    queryFn: () => fetchProductCosts(productId),
    enabled,
  });
};

export const useCreateProductCostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductCostInput) => {
      const result = await createProductCost(payload);
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({
          queryKey: getProductCostsQueryKey(variables.productId),
        });
        queryClient.invalidateQueries({
          queryKey: [...PRODUCT_QUERY_KEY, variables.productId],
        });
      }
    },
  });
};

export const useUpdateProductCostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProductCostInput) => {
      const result = await updateProductCost(payload);
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({
          queryKey: getProductCostsQueryKey(variables.productId),
        });
        queryClient.invalidateQueries({
          queryKey: [...PRODUCT_QUERY_KEY, variables.productId],
        });
      }
    },
  });
};

export const useDeleteProductCostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteProductCostInput) => {
      const result = await deleteProductCost(payload);
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({
          queryKey: getProductCostsQueryKey(variables.productId),
        });
        queryClient.invalidateQueries({
          queryKey: [...PRODUCT_QUERY_KEY, variables.productId],
        });
      }
    },
  });
};
