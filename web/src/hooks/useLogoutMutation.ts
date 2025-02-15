import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";

export const useLogoutMutation = () => {
  const clearUser = useUserStore((state) => state.clearUser);
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      clearUser();
      clearToken();
      navigate("/login");
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
