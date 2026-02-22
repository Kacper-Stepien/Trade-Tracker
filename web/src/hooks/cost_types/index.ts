import { ResultAsync } from "neverthrow";
import {
  CostType,
  CostTypesResponse,
  UpdateCostType,
} from "../../types/CostType.type";
import { axiosInstance } from "../../utils/axiosInstance";
import { ApiError } from "../../types/errors";
import { toResult } from "../../utils/resultWrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const COST_TYPES_QUERY_KEY = ["cost_types"];

type GetCostTypesParams = {
  page?: number;
  limit?: number;
};

const fetchCostTypes = async (
  params: GetCostTypesParams = {},
): Promise<CostTypesResponse> => {
  const response = await axiosInstance.get<CostTypesResponse | CostType[]>(
    "/cost-type",
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 1000,
      },
    },
  );

  if (Array.isArray(response.data)) {
    return {
      costTypes: response.data,
      total: response.data.length,
    };
  }

  return {
    costTypes: response.data.costTypes ?? [],
    total: response.data.total ?? 0,
  };
};

const fetchAllCostTypes = async (): Promise<CostType[]> => {
  const response = await axiosInstance.get<CostType[]>("/cost-type/all");
  return response.data;
};

export const createCostType = (
  name: string,
): ResultAsync<CostType, ApiError> => {
  return toResult(axiosInstance.post<CostType>("/cost-type", { name }));
};

export const updateCostType = ({ id, name }: UpdateCostType) => {
  return toResult(
    axiosInstance.patch<UpdateCostType>(`/cost-type/${id}`, { name }),
  );
};

export const deleteCostType = (id: number): ResultAsync<void, ApiError> => {
  return toResult(axiosInstance.delete(`/cost-type/${id}`));
};

export const useCostTypesQuery = () => {
  return useQuery({
    queryKey: [...COST_TYPES_QUERY_KEY, "all"],
    queryFn: fetchAllCostTypes,
  });
};

export const useCostTypesPaginatedQuery = (params: GetCostTypesParams = {}) => {
  return useQuery({
    queryKey: [
      ...COST_TYPES_QUERY_KEY,
      params.page ?? 1,
      params.limit ?? 1000,
      "paginated",
    ],
    queryFn: () => fetchCostTypes(params),
  });
};

export const useCreateCostTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const result = await createCostType(name);
      return result;
    },
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: COST_TYPES_QUERY_KEY });
      }
    },
    retry: false,
  });
};

export const useUpdateCostTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateCostType) => {
      const result = await updateCostType(params);
      return result;
    },
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: COST_TYPES_QUERY_KEY });
      }
    },
  });
};

export const useDeleteCostTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteCostType(id);
      return result;
    },
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.invalidateQueries({ queryKey: COST_TYPES_QUERY_KEY });
      }
    },
  });
};
