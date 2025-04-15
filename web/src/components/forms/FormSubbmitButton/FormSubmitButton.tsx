import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { FC } from "react";

interface FormSubmitButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const FormSubmitButton: FC<FormSubmitButtonProps> = ({
  isLoading,
  disabled,
  children,
  ...rest
}) => {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{ marginTop: "16px" }}
      fullWidth={true}
      size="large"
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default FormSubmitButton;
