import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";

interface LoginData {
  email: string;
  password: string;
}

export const useLoginMutation = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await axiosInstance.post("/auth/sign-in", data);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
    },
    onError: (error) => {
      console.error("Błąd logowania:", error);
    },
  });
};
