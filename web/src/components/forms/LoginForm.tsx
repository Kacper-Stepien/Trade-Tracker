import { Button, Stack, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../hooks/useLoginMutation";
import { useState } from "react";
import FormFooter from "./FormFooter";
import FormSubmitButton from "./FormSubmitButton";
import FormError from "./FormError";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormInputs>({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setServerError(null);
      await loginMutation.mutateAsync(data);
      // eslint-disable-next-line
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  const navigateToSignUpPage = () => {
    navigate("/register");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          id="email"
          label={t("email")}
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth={true}
          autoFocus
          {...register("email", {
            required: t("emailIsRequired"),
            pattern: { value: /^\S+@\S+$/i, message: t("emailIsIncorrect") },
          })}
        />
        <TextField
          type="password"
          id="password"
          label={t("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          fullWidth={true}
          {...register("password", {
            required: t("passwordIsRequired"),
            minLength: {
              value: 8,
              message: t("passwordMinLength"),
            },
          })}
        />
        {serverError && <FormError> {t(serverError)}</FormError>}
        <FormSubmitButton
          disabled={!isValid}
          isLoading={loginMutation.isLoading}
        >
          {t("login")}
        </FormSubmitButton>

        <Stack spacing={1}>
          <Typography variant="body2" align="center">
            {t("doesntHaveAnAccount")}
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={navigateToSignUpPage}
          >
            {t("registerNow")}
          </Button>
        </Stack>
        <FormFooter />
      </Stack>
    </form>
  );
};

export default LoginForm;
