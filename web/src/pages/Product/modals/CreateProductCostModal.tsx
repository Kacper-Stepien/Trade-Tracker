import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { BaseModal } from "../../../components/BaseModal/BaseModal";
import { useCreateProductCostMutation } from "../../../hooks/product_costs";
import { useCostTypesQuery } from "../../../hooks/cost_types";
import { translateError } from "../../../utils/translateError";

type Props = {
  open: boolean;
  productId: number;
  onClose: () => void;
};

type FormValues = {
  name: string;
  description: string;
  price: string;
  date: Dayjs | null;
  costTypeId: string;
};

export const CreateProductCostModal = ({ open, productId, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const createMutation = useCreateProductCostMutation();
  const { data: costTypes } = useCostTypesQuery();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      date: null,
      costTypeId: "",
    },
  });

  const handleClose = () => {
    createMutation.reset();
    setFormError(null);
    reset();
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    const result = await createMutation.mutateAsync({
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      date: values.date?.format("YYYY-MM-DD") ?? "",
      productId,
      costTypeId: Number(values.costTypeId),
    });

    result.match(
      () => handleClose(),
      (error) => setFormError(translateError(error)),
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={t("pages.productDetails.costs.addModal.title")}
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={createMutation.isLoading}
            startIcon={
              createMutation.isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {t("common.actions.create")}
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

        <TextField
          select
          label={t("pages.productDetails.costs.fields.costType")}
          error={!!errors.costTypeId}
          helperText={
            errors.costTypeId ? t("pages.addProduct.validation.required") : " "
          }
          {...register("costTypeId", { required: true })}
        >
          {costTypes?.map((costType) => (
            <MenuItem key={costType.id} value={String(costType.id)}>
              {costType.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </BaseModal>
  );
};

