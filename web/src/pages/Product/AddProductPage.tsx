import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, Theme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useCategoriesQuery } from "../../hooks/categories";
import { useCreateProductMutation } from "../../hooks/products";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { translateError } from "../../utils/translateError";

const modernInputSx = {
  "& .MuiFilledInput-root": (theme: Theme) => ({
    borderRadius: 1.5,
    bgcolor: "background.default",
    border: "1px solid",
    borderColor: "divider",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      bgcolor: "action.hover",
      borderColor: "text.disabled",
    },
    "&.Mui-focused": {
      bgcolor: "background.paper",
      borderColor: "primary.main",
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.16)}`,
    },
  }),
};

const sectionCardSx = {
  borderRadius: 2,
  p: 2.5,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
};

const sectionTitleSx = {
  fontSize: "0.95rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "primary.main",
  mb: 1.5,
};

type AddProductFormData = {
  name: string;
  purchasePrice: string;
  purchaseDate: Dayjs | null;
  categoryId: string;
  attributes: {
    name: string;
    value: string;
  }[];
};

export const AddProductPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: categories, isLoading, isError } = useCategoriesQuery();
  const createProductMutation = useCreateProductMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormData>({
    defaultValues: {
      name: "",
      purchasePrice: "",
      purchaseDate: dayjs(),
      categoryId: "",
      attributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const onSubmit = async (values: AddProductFormData) => {
    setFormError(null);

    const attributes = values.attributes
      .map((attribute) => ({
        name: attribute.name.trim(),
        value: attribute.value.trim(),
      }))
      .filter((attribute) => attribute.name && attribute.value);

    const result = await createProductMutation.mutateAsync({
      name: values.name.trim(),
      purchasePrice: Number(values.purchasePrice),
      purchaseDate: values.purchaseDate?.format("YYYY-MM-DD") ?? "",
      categoryId: Number(values.categoryId),
      attributes: attributes.length ? attributes : undefined,
    });

    result.match(
      () => navigate("/products"),
      (error) => setFormError(translateError(error)),
    );
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return <Alert severity="error">{t("common.errors.fetchFailed")}</Alert>;
  }

  return (
    <Box sx={{ pb: 1 }}>
      <Box mb={2.5}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={() => navigate("/products")}
            size="small"
            sx={{
              bgcolor: "action.hover",
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Breadcrumbs sx={{ fontSize: "0.875rem" }}>
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/products")}
              sx={{ cursor: "pointer" }}
            >
              {t("pages.products.title")}
            </Link>
            <Typography color="text.primary" fontWeight={500}>
              {t("pages.addProduct.title")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box mb={4}>
        <Typography variant="h4" fontWeight={600}>
          {t("pages.addProduct.title")}
        </Typography>
        <Typography variant="body2">
          {t("pages.addProduct.description")}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
              gap: 2,
            }}
          >
            <Paper elevation={0} sx={sectionCardSx}>
              <Typography sx={sectionTitleSx}>
                {t("pages.addProduct.sections.productInfo")}
              </Typography>
              <Stack spacing={1.5}>
                <TextField
                  variant="filled"
                  label={t("pages.addProduct.fields.name")}
                  fullWidth
                  InputProps={{ disableUnderline: true }}
                  sx={modernInputSx}
                  error={!!errors.name}
                  helperText={
                    errors.name
                      ? t("pages.addProduct.validation.required")
                      : " "
                  }
                  {...register("name", { required: true })}
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 1.5,
                  }}
                >
                  <TextField
                    variant="filled"
                    label={t("pages.addProduct.fields.purchasePrice")}
                    type="number"
                    fullWidth
                    InputProps={{
                      disableUnderline: true,
                      inputProps: { step: "0.01", min: 0 },
                    }}
                    sx={modernInputSx}
                    error={!!errors.purchasePrice}
                    helperText={
                      errors.purchasePrice
                        ? t("pages.addProduct.validation.required")
                        : " "
                    }
                    {...register("purchasePrice", { required: true })}
                  />
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={i18n.language}
                  >
                    <Controller
                      name="purchaseDate"
                      control={control}
                      rules={{
                        required: t("pages.addProduct.validation.required"),
                      }}
                      render={({ field, fieldState }) => (
                        <DatePicker
                          label={t("pages.addProduct.fields.purchaseDate")}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          slotProps={{
                            textField: {
                              variant: "filled",
                              fullWidth: true,
                              sx: modernInputSx,
                              error: !!fieldState.error,
                              helperText: fieldState.error?.message ?? " ",
                              InputProps: { disableUnderline: true },
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
              </Stack>
            </Paper>

            <Paper elevation={0} sx={sectionCardSx}>
              <Typography sx={sectionTitleSx}>
                {t("pages.addProduct.sections.category")}
              </Typography>
              <TextField
                variant="filled"
                select
                label={t("pages.addProduct.fields.category")}
                fullWidth
                InputProps={{ disableUnderline: true }}
                sx={modernInputSx}
                error={!!errors.categoryId}
                helperText={
                  errors.categoryId
                    ? t("pages.addProduct.validation.required")
                    : " "
                }
                {...register("categoryId", { required: true })}
              >
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Paper>
          </Box>

          <Paper elevation={0} sx={sectionCardSx}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Typography sx={{ ...sectionTitleSx, mb: 0.4 }}>
                  {t("pages.addProduct.sections.attributes")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("pages.addProduct.fields.noAttributes")}
                </Typography>
              </Box>
              <Button
                type="button"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => append({ name: "", value: "" })}
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  fontWeight: 700,
                }}
              >
                {t("pages.addProduct.actions.addAttribute")}
              </Button>
            </Box>

            {fields.length === 0 && (
              <Box
                sx={{
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "divider",
                  minHeight: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  bgcolor: "background.default",
                }}
              >
                {t("pages.addProduct.fields.noAttributes")}
              </Box>
            )}

            <Stack spacing={1.5}>
              {fields.map((field, index) => (
                <Paper
                  key={field.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    bgcolor: "background.default",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      {`${t("pages.addProduct.sections.attributes")} #${index + 1}`}
                    </Typography>
                    <IconButton
                      onClick={() => remove(index)}
                      color="error"
                      size="small"
                      aria-label={t("pages.addProduct.actions.removeAttribute")}
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 2, opacity: 0.6 }} />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      variant="filled"
                      label={t("pages.addProduct.fields.attributeName")}
                      fullWidth
                      InputProps={{ disableUnderline: true }}
                      sx={modernInputSx}
                      {...register(`attributes.${index}.name`)}
                    />
                    <TextField
                      variant="filled"
                      label={t("pages.addProduct.fields.attributeValue")}
                      fullWidth
                      InputProps={{ disableUnderline: true }}
                      sx={modernInputSx}
                      {...register(`attributes.${index}.value`)}
                    />
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Paper>

          {formError && <Alert severity="error">{formError}</Alert>}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              type="button"
              onClick={() => navigate("/products")}
              color="inherit"
            >
              {t("common.actions.cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createProductMutation.isLoading}
            >
              {t("common.actions.create")}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};
