import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { BaseModal } from "../../components/BaseModal/BaseModal";
import { Product } from "../../types/Product";
import { useUpdateProductMutation } from "../../hooks/products";
import { useCategoriesQuery } from "../../hooks/categories";
import { translateError } from "../../utils/translateError";

type Props = {
  product: Product | null;
  initialFocusField?: EditProductFocusField | null;
  onClose: () => void;
};

export type EditProductFocusField =
  | "name"
  | "purchasePrice"
  | "purchaseDate"
  | "categoryId";

type FormValues = {
  name: string;
  purchasePrice: string;
  purchaseDate: Dayjs | null;
  categoryId: string;
};

export const EditProductModal = ({
  product,
  initialFocusField,
  onClose,
}: Props) => {
  const { t, i18n } = useTranslation();
  const updateMutation = useUpdateProductMutation();
  const { data: categories } = useCategoriesQuery();
  const [formError, setFormError] = useState<string | null>(null);
  const purchaseDateInputRef = useRef<HTMLInputElement | null>(null);
  const categoryInputRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    register,
    reset,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      purchasePrice: "",
      purchaseDate: null,
      categoryId: "",
    },
  });

  useEffect(() => {
    if (!product) return;
    reset({
      name: product.name,
      purchasePrice: String(product.purchasePrice),
      purchaseDate: product.purchaseDate ? dayjs(product.purchaseDate) : null,
      categoryId: product.category ? String(product.category.id) : "",
    });
  }, [product, reset]);

  useEffect(() => {
    if (!product || !initialFocusField) return;

    const timeoutId = window.setTimeout(() => {
      if (initialFocusField === "purchaseDate") {
        purchaseDateInputRef.current?.focus();
        return;
      }

      if (initialFocusField === "categoryId") {
        categoryInputRef.current?.focus();
        return;
      }

      setFocus(initialFocusField);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [product, initialFocusField, setFocus]);

  const handleClose = () => {
    updateMutation.reset();
    setFormError(null);
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    if (!product) return;
    setFormError(null);

    const result = await updateMutation.mutateAsync({
      id: product.id,
      name: values.name.trim(),
      purchasePrice: Number(values.purchasePrice),
      purchaseDate: values.purchaseDate?.format("YYYY-MM-DD"),
      categoryId: Number(values.categoryId),
    });

    result.match(
      () => handleClose(),
      (error) => setFormError(translateError(error)),
    );
  };

  return (
    <BaseModal
      open={!!product}
      onClose={handleClose}
      title={t("pages.productDetails.productModals.edit.title")}
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={updateMutation.isLoading}
            startIcon={
              updateMutation.isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {t("common.actions.save")}
          </Button>
        </>
      }
    >
      <Stack spacing={2} mt={1}>
        {formError && <Alert severity="error">{formError}</Alert>}
        <TextField
          label={t("pages.addProduct.fields.name")}
          error={!!errors.name}
          helperText={
            errors.name ? t("pages.addProduct.validation.required") : " "
          }
          {...register("name", { required: true })}
        />
        <TextField
          label={t("pages.addProduct.fields.purchasePrice")}
          type="number"
          inputProps={{ step: "0.01", min: 0 }}
          error={!!errors.purchasePrice}
          helperText={
            errors.purchasePrice
              ? t("pages.addProduct.validation.required")
              : " "
          }
          {...register("purchasePrice", { required: true })}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
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
                    inputRef: purchaseDateInputRef,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message ?? " ",
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
        <Controller
          name="categoryId"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <TextField
              select
              label={t("pages.addProduct.fields.category")}
              value={field.value}
              onChange={field.onChange}
              inputRef={categoryInputRef}
              error={!!fieldState.error}
              helperText={
                fieldState.error ? t("pages.addProduct.validation.required") : " "
              }
            >
              {categories?.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Stack>
    </BaseModal>
  );
};
