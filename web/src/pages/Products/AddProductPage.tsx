import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useCategoriesQuery } from "../../hooks/categories";
import { useCreateProductMutation } from "../../hooks/products";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { translateError } from "../../utils/translateError";

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
      purchaseDate: null,
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
    <Box>
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
          <Paper elevation={0} sx={{ borderRadius: 2, p: 3 }}>
            <Typography variant="h6" mb={2}>
              {t("pages.addProduct.sections.productInfo")}
            </Typography>
            <Stack spacing={2}>
              <TextField
                label={t("pages.addProduct.fields.name")}
                fullWidth
                error={!!errors.name}
                helperText={
                  errors.name ? t("pages.addProduct.validation.required") : " "
                }
                {...register("name", { required: true })}
              />
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label={t("pages.addProduct.fields.purchasePrice")}
                  type="number"
                  fullWidth
                  inputProps={{ step: "0.01", min: 0 }}
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
                    rules={{ required: t("pages.addProduct.validation.required") }}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        label={t("pages.addProduct.fields.purchaseDate")}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message ?? " ",
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Stack>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: 2, p: 3 }}>
            <Typography variant="h6" mb={2}>
              {t("pages.addProduct.sections.category")}
            </Typography>
            <TextField
              select
              label={t("pages.addProduct.fields.category")}
              fullWidth
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

          <Paper elevation={0} sx={{ borderRadius: 2, p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">
                {t("pages.addProduct.sections.attributes")}
              </Typography>
              <Button
                type="button"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => append({ name: "", value: "" })}
              >
                {t("pages.addProduct.actions.addAttribute")}
              </Button>
            </Box>

            {fields.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                {t("pages.addProduct.fields.noAttributes")}
              </Typography>
            )}

            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Stack
                  key={field.id}
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems={{ xs: "stretch", md: "center" }}
                >
                  <TextField
                    label={t("pages.addProduct.fields.attributeName")}
                    fullWidth
                    {...register(`attributes.${index}.name`)}
                  />
                  <TextField
                    label={t("pages.addProduct.fields.attributeValue")}
                    fullWidth
                    {...register(`attributes.${index}.value`)}
                  />
                  <IconButton
                    onClick={() => remove(index)}
                    color="error"
                    aria-label={t("pages.addProduct.actions.removeAttribute")}
                  >
                    <DeleteOutlinedIcon />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {formError && (
            <Alert severity="error">
              {formError}
            </Alert>
          )}

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
