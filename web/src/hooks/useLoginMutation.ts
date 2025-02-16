import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { AxiosError } from "../types/AxiosError.type";
import { User } from "../types/User.type";
import { SignIn } from "../types/SignIn.type";

interface LoginResponse {
  token: string;
  user: User;
}

export const useLoginMutation = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

  return useMutation<LoginResponse, AxiosError, SignIn>({
    mutationFn: async (data: SignIn) => {
      const response = await axiosInstance.post("/auth/sign-in", data);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
    },
    onError: (error: AxiosError) => {
      const errorMessage = error?.response?.data?.message || "UNEXPECTED_ERROR";
      throw new Error(errorMessage);
    },
  });
};
