import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { BaseModal } from "../../components/BaseModal/BaseModal";
import { ProductAttribute } from "../../types/Product";
import { useUpdateProductAttributeMutation } from "../../hooks/product_attributes";
import { translateError } from "../../utils/translateError";

type Props = {
  productId: number;
  attribute: ProductAttribute | null;
  onClose: () => void;
};

type FormValues = {
  name: string;
  value: string;
};

export const EditProductAttributeModal = ({
  productId,
  attribute,
  onClose,
}: Props) => {
  const { t } = useTranslation();
  const updateMutation = useUpdateProductAttributeMutation();
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

  useEffect(() => {
    if (!attribute) return;
    reset({
      name: attribute.name,
      value: attribute.value,
    });
  }, [attribute, reset]);

  const handleClose = () => {
    updateMutation.reset();
    setFormError(null);
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    if (!attribute) return;
    setFormError(null);
    const result = await updateMutation.mutateAsync({
      productId,
      attributeId: attribute.id,
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
      open={!!attribute}
      onClose={handleClose}
      title={t("pages.productDetails.attributes.editModal.title")}
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
