import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import "dayjs/locale/en";
import "dayjs/locale/pl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../../hooks/useRegisterMutation";
import { useState } from "react";
import FormSubmitButton from "../FormSubbmitButton/FormSubmitButton";
import AuthFormFooter from "../AuthFormFooter/AuthFormFooter";
import InputError from "../InputError/InputError";
import FormSuccess from "../FormSuccess/FormSuccess";

interface FormInputs {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Dayjs | null;
  isProfessional: boolean;
}

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const [unavailableEmails, setUnavailableEmails] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<FormInputs>({
    mode: "onChange",
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: null,
      isProfessional: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setServerError(null);
      await registerMutation.mutateAsync(data);
      setSuccessMessage("Account created successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      // eslint-disable-next-line
    } catch (error: any) {
      if (error.message === "USER_WITH_GIVEN_EMAIL_ALREADY_EXISTS") {
        setUnavailableEmails((prev) => [...prev, data.email]);
        form.setError("email", {
          type: "server",
          message: t("USER_WITH_GIVEN_EMAIL_ALREADY_EXISTS"),
        });
      } else {
        setServerError(error.message);
      }
    }
  };

  const navigateToSignInPage = () => {
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          id="name"
          label={t("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
          fullWidth={true}
          {...register("name", {
            required: t("nameIsRequired"),
          })}
        />
        <TextField
          id="surname"
          label={t("surname")}
          error={!!errors.surname}
          helperText={errors.surname?.message}
          fullWidth={true}
          {...register("surname", {
            required: t("surnameIsRequired"),
          })}
        />
        <TextField
          id="email"
          label={t("email")}
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth={true}
          {...register("email", {
            required: t("emailIsRequired"),
            validate: (value) =>
              unavailableEmails.includes(value)
                ? t("USER_WITH_GIVEN_EMAIL_ALREADY_EXISTS")
                : true,
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
        <TextField
          type="password"
          id="confirmPassword"
          label={t("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          fullWidth={true}
          {...register("confirmPassword", {
            required: t("passwordIsRequired"),
            validate: (value) =>
              value === form.getValues("password") || t("passwordsMustMatch"),
          })}
        />
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language}
        >
          <Controller
            name="dateOfBirth"
            control={form.control}
            rules={{
              required: t("dateIsRequired"),
            }}
            render={({ field, fieldState }) => (
              <DatePicker
                label={t("dateOfBirth")}
                value={field.value}
                onChange={(date) => field.onChange(date)}
                disableFuture
                slotProps={{
                  textField: {
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message,
                    fullWidth: true,
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox {...register("isProfessional")} />}
            label={t("isProfessional")}
          />
        </FormGroup>
        {serverError && <InputError>{t(serverError)}</InputError>}
        {successMessage && <FormSuccess> {t("SUCCESS_SING_UP")}</FormSuccess>}
        <FormSubmitButton
          disabled={!isValid}
          isLoading={registerMutation.isLoading}
        >
          {t("register")}
        </FormSubmitButton>

        <Stack spacing={1}>
          <Typography variant="body2" align="center">
            {t("haveAnAccount")}
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={navigateToSignInPage}
          >
            {t("login")}
          </Button>
        </Stack>
        <AuthFormFooter />
      </Stack>
    </form>
  );
};

export default RegisterForm;
