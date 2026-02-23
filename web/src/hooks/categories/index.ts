import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoriesResponse, Category } from "../../types/Category.type";
import { axiosInstance } from "../../utils/axiosInstance";
import { ResultAsync } from "neverthrow";
import { ApiError } from "../../types/errors";
import { toResult } from "../../utils/resultWrapper";

export const CATEGORIES_QUERY_KEY = ["categories"];

type GetCategoriesParams = {
  page?: number;
  limit?: number;
};

const fetchCategories = async (
  params: GetCategoriesParams = {},
): Promise<CategoriesResponse> => {
  const response = await axiosInstance.get<CategoriesResponse>(
    "/product-categories",
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 1000,
      },
    },
  );
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

export const useCategoriesQuery = (params: GetCategoriesParams = {}) => {
  return useQuery({
    queryKey: [
      ...CATEGORIES_QUERY_KEY,
      params.page ?? 1,
      params.limit ?? 1000,
    ],
    queryFn: () => fetchCategories(params),
    select: (data) => data.categories,
  });
};

export const useCategoriesPaginatedQuery = (
  params: GetCategoriesParams = {},
) => {
  return useQuery({
    queryKey: [
      ...CATEGORIES_QUERY_KEY,
      params.page ?? 1,
      params.limit ?? 1000,
      "paginated",
    ],
    queryFn: () => fetchCategories(params),
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
