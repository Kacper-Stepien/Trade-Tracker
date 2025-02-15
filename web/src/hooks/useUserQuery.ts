import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";

export const useUserQuery = () => {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const clearToken = useAuthStore((state) => state.clearToken);

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/me");
      return response.data;
    },
    onSuccess: (user) => {
      setUser(user);
    },
    onError: () => {
      clearUser();
      clearToken();
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
