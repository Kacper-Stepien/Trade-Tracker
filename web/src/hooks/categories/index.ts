import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "../../types/Category.type";
import { axiosInstance } from "../../utils/axiosInstance";

export const CATEGORIES_QUERY_KEY = ["categories"];

const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>("/product-categories");
  return response.data;
};

const createCategory = async (name: string): Promise<Category> => {
  const response = await axiosInstance.post<Category>("/product-categories", {
    name,
  });
  return response.data;
};

const updateCategory = async ({
  id,
  name,
}: {
  id: number;
  name: string;
}): Promise<Category> => {
  const response = await axiosInstance.patch<Category>(
    `/product-categories/${id}`,
    { name },
  );
  return response.data;
};

const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/product-categories/${id}`);
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
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
};
