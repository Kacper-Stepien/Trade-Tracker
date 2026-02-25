import { ReactNode } from "react";
import { Alert } from "@mui/material";
import { PageLoader } from "../PageLoader/PageLoader";

type AsyncStateBoundaryProps<T> = {
  data: T | null | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  children: (data: T) => ReactNode;
};

export const AsyncStateBoundary = <T,>({
  data,
  isLoading,
  isError,
  errorMessage,
  children,
}: AsyncStateBoundaryProps<T>) => {
  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || data === null || data === undefined) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  return <>{children(data)}</>;
};
