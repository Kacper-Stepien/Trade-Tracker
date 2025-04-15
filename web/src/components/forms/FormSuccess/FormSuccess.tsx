import { Alert } from "@mui/material";
import { FC, ReactNode } from "react";

interface FormSuccessProps {
  children: ReactNode;
}

const FormSuccess: FC<FormSuccessProps> = ({ children }) => {
  return (
    <Alert severity="success" variant="filled">
      {children}
    </Alert>
  );
};

export default FormSuccess;
