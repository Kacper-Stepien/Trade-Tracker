import { Alert } from "@mui/material";
import { FC, ReactNode } from "react";

interface InputErrorProps {
  children: ReactNode;
}

const InputError: FC<InputErrorProps> = ({ children }) => {
  return (
    <Alert severity="error" variant="filled" role="alert">
      {children}
    </Alert>
  );
};

export default InputError;
