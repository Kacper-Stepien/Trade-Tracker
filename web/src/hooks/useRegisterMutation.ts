import { useMutation } from "@tanstack/react-query";
import { SignUp } from "../types/SignUp.type";
import { axiosInstance } from "../utils/axiosInstance";
import { AxiosError } from "../types/AxiosError.type";
import { User } from "../types/User.type";

interface RegisterResponse {
  user: User;
}

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, AxiosError, SignUp>({
    mutationFn: async (data: SignUp) => {
      const response = await axiosInstance.post("/auth/sign-up", data);
      return response.data;
    },
    onSuccess: () => {},
    onError: (error: AxiosError) => {
      const errorMessage = error?.response?.data?.message || "UNEXPECTED_ERROR";
      throw new Error(errorMessage);
    },
  });
};
