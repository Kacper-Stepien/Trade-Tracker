import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "../../types/Category.type";
import { axiosInstance } from "../../utils/axiosInstance";
import { ResultAsync } from "neverthrow";
import { ApiError } from "../../types/errors";
import { toResult } from "../../utils/resultWrapper";

export const CATEGORIES_QUERY_KEY = ["categories"];

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>("/product-categories");
  return response.data;
};

export const createCategory = (
  name: string,
): ResultAsync<Category, ApiError> => {
  return toResult(
    axiosInstance.post<Category>("/product-categories", { name }),
  );
};

export const updateCategory = ({
  id,
  name,
}: {
  id: number;
  name: string;
}): ResultAsync<Category, ApiError> => {
  return toResult(
    axiosInstance.patch<Category>(`/product-categories/${id}`, { name }),
  );
};

export const deleteCategory = (id: number): ResultAsync<void, ApiError> => {
  return toResult(axiosInstance.delete(`/product-categories/${id}`));
};

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: fetchCategories,
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const result = await createCategory(name);
      return result;
    },
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      }
    },
    retry: false,
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: number; name: string }) => {
      const result = await updateCategory(params);
      return result;
    },
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      }
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteCategory(id);
      return result;
    },
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      }
    },
  });
};
