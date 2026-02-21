import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResultAsync } from "neverthrow";
import { axiosInstance } from "../../utils/axiosInstance";
import { toResult } from "../../utils/resultWrapper";
import { ApiError } from "../../types/errors";
import {
  CreateProductAttributeMutationInput,
  DeleteProductAttributeInput,
  ProductAttribute,
  UpdateProductAttributeInput,
} from "../../types/Product";
import { PRODUCT_QUERY_KEY } from "../products";

export const createProductAttribute = (
  payload: CreateProductAttributeMutationInput,
): ResultAsync<ProductAttribute, ApiError> => {
  const { productId, ...body } = payload;
  return toResult(
    axiosInstance.post<ProductAttribute>(`/product-attribute/${productId}`, body),
  );
};

export const updateProductAttribute = (
  payload: UpdateProductAttributeInput,
): ResultAsync<ProductAttribute, ApiError> => {
  const { productId, attributeId, ...body } = payload;
  return toResult(
    axiosInstance.patch<ProductAttribute>(
      `/product-attribute/${productId}/${attributeId}`,
      body,
    ),
  );
};

export const deleteProductAttribute = (
  payload: DeleteProductAttributeInput,
): ResultAsync<void, ApiError> => {
  const { productId, attributeId } = payload;
  return toResult(
    axiosInstance.delete(`/product-attribute/${productId}/${attributeId}`),
  );
};

export const useCreateProductAttributeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductAttributeMutationInput) => {
      const result = await createProductAttribute(payload);
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({
          queryKey: [...PRODUCT_QUERY_KEY, variables.productId],
        });
      }
    },
  });
};

export const useUpdateProductAttributeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProductAttributeInput) => {
      const result = await updateProductAttribute(payload);
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({
          queryKey: [...PRODUCT_QUERY_KEY, variables.productId],
        });
      }
    },
  });
};

export const useDeleteProductAttributeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DeleteProductAttributeInput) => {
      const result = await deleteProductAttribute(payload);
      return result;
    },
    onSuccess: (result, variables) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({
          queryKey: [...PRODUCT_QUERY_KEY, variables.productId],
        });
      }
    },
  });
};
