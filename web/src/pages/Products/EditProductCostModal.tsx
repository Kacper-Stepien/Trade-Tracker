import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { BaseModal } from "../../components/BaseModal/BaseModal";
import { useUpdateProductCostMutation } from "../../hooks/product_costs";
import { ProductCost } from "../../types/Product";
import { translateError } from "../../utils/translateError";

type Props = {
  productId: number;
  cost: ProductCost | null;
  onClose: () => void;
};

type FormValues = {
  name: string;
  description: string;
  price: string;
  date: Dayjs | null;
};

export const EditProductCostModal = ({ productId, cost, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const updateMutation = useUpdateProductCostMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      date: null,
    },
  });

  useEffect(() => {
    if (!cost) {
      return;
    }
    reset({
      name: cost.name,
      description: cost.description ?? "",
      price: String(cost.price),
      date: cost.date ? dayjs(cost.date) : null,
    });
  }, [cost, reset]);

  const handleClose = () => {
    updateMutation.reset();
    setFormError(null);
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    if (!cost) return;

    setFormError(null);
    const result = await updateMutation.mutateAsync({
      id: cost.id,
      productId,
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      date: values.date?.format("YYYY-MM-DD"),
    });

    result.match(
      () => handleClose(),
      (error) => setFormError(translateError(error)),
    );
  };

  return (
    <BaseModal
      open={!!cost}
      onClose={handleClose}
      title={t("pages.productDetails.costs.editModal.title")}
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
          label={t("pages.productDetails.costs.fields.name")}
          error={!!errors.name}
          helperText={
            errors.name ? t("pages.addProduct.validation.required") : " "
          }
          {...register("name", { required: true })}
        />

        <TextField
          label={t("pages.productDetails.costs.fields.description")}
          error={!!errors.description}
          helperText={
            errors.description ? t("pages.addProduct.validation.required") : " "
          }
          {...register("description", { required: true })}
        />

        <TextField
          label={t("pages.productDetails.costs.fields.price")}
          type="number"
          inputProps={{ step: "0.01", min: 0 }}
          error={!!errors.price}
          helperText={
            errors.price ? t("pages.addProduct.validation.required") : " "
          }
          {...register("price", { required: true })}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
          <Controller
            name="date"
            control={control}
            rules={{ required: t("pages.addProduct.validation.required") }}
            render={({ field, fieldState }) => (
              <DatePicker
                label={t("pages.productDetails.costs.fields.date")}
                value={field.value}
                onChange={(date) => field.onChange(date)}
                slotProps={{
                  textField: {
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message ?? " ",
                    fullWidth: true,
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Stack>
    </BaseModal>
  );
};
