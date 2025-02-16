import { Alert } from "@mui/material";
import { FC, ReactNode } from "react";

interface FormErrorProps {
  children: ReactNode;
}

const FormError: FC<FormErrorProps> = ({ children }) => {
  return (
    <Alert severity="error" variant="filled">
      {children}
    </Alert>
  );
};

export default FormError;
