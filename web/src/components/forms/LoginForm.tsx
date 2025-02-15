import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../ui/GoogleButton";
import { useLoginMutation } from "../../hooks/useLoginMutation";

interface FormInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const form = useForm<FormInputs>({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const loginMutation = useLoginMutation();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    loginMutation.mutate(data);
  };

  const goToRegisterPage = () => {
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
        <Button
          type="submit"
          variant="contained"
          sx={{ marginTop: "16px" }}
          fullWidth={true}
          size="large"
        >
          {t("login")}
        </Button>
        <Stack spacing={1}>
          <Typography variant="body2" align="center">
            {t("doesntHaveAnAccount")}
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={goToRegisterPage}
          >
            {t("registerNow")}
          </Button>
        </Stack>
        <Divider>{t("or")}</Divider>
        <GoogleButton />
      </Stack>
    </form>
  );
}
