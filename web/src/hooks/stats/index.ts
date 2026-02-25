import { useQuery } from "@tanstack/react-query";
import { StatsCharts, StatsRange, UserStats } from "../../types/Stats";
import { axiosInstance } from "../../utils/axiosInstance";

export const USER_STATS_QUERY_KEY = ["user-stats"];
export const USER_STATS_BY_RANGE_QUERY_KEY = ["user-stats-by-range"];
export const USER_STATS_CHARTS_QUERY_KEY = ["user-stats-charts"];

const fetchUserStats = async (): Promise<UserStats> => {
  const response = await axiosInstance.get<UserStats>("/stats");
  return response.data;
};

const fetchUserStatsByRange = async (range: StatsRange): Promise<UserStats> => {
  const response = await axiosInstance.get<UserStats>(`/stats/range/${range}`);
  return response.data;
};

const fetchUserStatsChartsByRange = async (
  range: StatsRange,
): Promise<StatsCharts> => {
  const response = await axiosInstance.get<StatsCharts>(`/stats/charts/${range}`);
  return response.data;
};

export const useUserStatsQuery = () => {
  return useQuery({
    queryKey: USER_STATS_QUERY_KEY,
    queryFn: fetchUserStats,
  });
};

export const useUserStatsByRangeQuery = (range: StatsRange) => {
  return useQuery({
    queryKey: [...USER_STATS_BY_RANGE_QUERY_KEY, range],
    queryFn: () => fetchUserStatsByRange(range),
  });
};

export const useUserStatsChartsByRangeQuery = (range: StatsRange) => {
  return useQuery({
    queryKey: [...USER_STATS_CHARTS_QUERY_KEY, range],
    queryFn: () => fetchUserStatsChartsByRange(range),
  });
};
