import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { BaseModal } from "../../components/BaseModal/BaseModal";
import { useCreateProductAttributeMutation } from "../../hooks/product_attributes";
import { translateError } from "../../utils/translateError";

type Props = {
  open: boolean;
  productId: number;
  onClose: () => void;
};

type FormValues = {
  name: string;
  value: string;
};

export const CreateProductAttributeModal = ({
  open,
  productId,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const createMutation = useCreateProductAttributeMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      value: "",
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
      productId,
      name: values.name.trim(),
      value: values.value.trim(),
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
      title={t("pages.productDetails.attributes.addModal.title")}
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
          label={t("pages.productDetails.attributes.fields.name")}
          error={!!errors.name}
          helperText={
            errors.name ? t("pages.addProduct.validation.required") : " "
          }
          {...register("name", { required: true })}
        />
        <TextField
          label={t("pages.productDetails.attributes.fields.value")}
          error={!!errors.value}
          helperText={
            errors.value ? t("pages.addProduct.validation.required") : " "
          }
          {...register("value", { required: true })}
        />
      </Stack>
    </BaseModal>
  );
};
