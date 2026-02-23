import { useQuery } from "@tanstack/react-query";
import { UserStats } from "../../types/Stats";
import { axiosInstance } from "../../utils/axiosInstance";

export const USER_STATS_QUERY_KEY = ["user-stats"];

const fetchUserStats = async (): Promise<UserStats> => {
  const response = await axiosInstance.get<UserStats>("/stats");
  return response.data;
};

export const useUserStatsQuery = () => {
  return useQuery({
    queryKey: USER_STATS_QUERY_KEY,
    queryFn: fetchUserStats,
  });
};
