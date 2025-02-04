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
import { useForm, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface FormInputs {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Dayjs;
  isProfessional: boolean;
}

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const form = useForm<FormInputs>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: Date(),
      isProfessional: false,
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormInputs> = async (data, event) => {
    event?.preventDefault();
    console.log(data);
  };

  const goToLoginPage = () => {
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
        />
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language}
        >
          <DatePicker
            label="Data urodzenia"
            onChange={(date) => {
              if (date) {
                form.setValue("dateOfBirth", date);
              }
            }}
          />
        </LocalizationProvider>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox {...register("isProfessional")} />}
            label={t("isProfessional")}
          />
        </FormGroup>
        <Button type="submit" variant="contained" fullWidth={true} size="large">
          {t("register")}
        </Button>
        <Stack spacing={1}>
          <Typography variant="body2" align="center">
            {t("haveAnAccount")}
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={goToLoginPage}
          >
            {t("login")}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default RegisterForm;
