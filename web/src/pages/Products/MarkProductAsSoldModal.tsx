import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { Dayjs } from "dayjs";
import { BaseModal } from "../../components/BaseModal/BaseModal";
import { useMarkProductAsSoldMutation } from "../../hooks/products";
import { translateError } from "../../utils/translateError";

type Props = {
  open: boolean;
  productId: number;
  initialFocusField?: MarkProductAsSoldFocusField | null;
  onClose: () => void;
};

export type MarkProductAsSoldFocusField = "salePrice" | "saleDate";

type FormValues = {
  salePrice: string;
  saleDate: Dayjs | null;
};

export const MarkProductAsSoldModal = ({
  open,
  productId,
  initialFocusField,
  onClose,
}: Props) => {
  const { t, i18n } = useTranslation();
  const soldMutation = useMarkProductAsSoldMutation();
  const [formError, setFormError] = useState<string | null>(null);
  const saleDateInputRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      salePrice: "",
      saleDate: null,
    },
  });

  const handleClose = () => {
    soldMutation.reset();
    setFormError(null);
    reset();
    onClose();
  };

  useEffect(() => {
    if (!open || !initialFocusField) return;
    const timeoutId = window.setTimeout(() => {
      if (initialFocusField === "saleDate") {
        saleDateInputRef.current?.focus();
        return;
      }

      setFocus("salePrice");
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [open, initialFocusField, setFocus]);

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    const result = await soldMutation.mutateAsync({
      id: productId,
      salePrice: Number(values.salePrice),
      saleDate: values.saleDate?.format("YYYY-MM-DD") ?? "",
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
      title={t("pages.productDetails.productModals.markSold.title")}
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={soldMutation.isLoading}
            startIcon={
              soldMutation.isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {t("pages.productDetails.actions.markAsSold")}
          </Button>
        </>
      }
    >
      <Stack spacing={2} mt={1}>
        {formError && <Alert severity="error">{formError}</Alert>}
        <TextField
          label={t("pages.productDetails.fields.salePrice")}
          type="number"
          inputProps={{ step: "0.01", min: 0 }}
          error={!!errors.salePrice}
          helperText={
            errors.salePrice ? t("pages.addProduct.validation.required") : " "
          }
          {...register("salePrice", { required: true })}
        />
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language}
        >
          <Controller
            name="saleDate"
            control={control}
            rules={{ required: t("pages.addProduct.validation.required") }}
            render={({ field, fieldState }) => (
              <DatePicker
                label={t("pages.productDetails.fields.saleDate")}
                value={field.value}
                onChange={(date) => field.onChange(date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputRef: saleDateInputRef,
                    error: !!fieldState.error,
                    helperText: fieldState.error?.message ?? " ",
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
