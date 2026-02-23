import { useUserStore } from "../store/userStore";
import { Role } from "../types/Role.type";

export const useIsAdmin = (): boolean => {
  const userRole = useUserStore((state) => state.user?.role);
  return userRole === Role.ADMIN;
};
