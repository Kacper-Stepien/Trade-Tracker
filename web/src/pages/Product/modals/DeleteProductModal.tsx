import { useState } from "react";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BaseModal } from "../../../components/BaseModal/BaseModal";
import { useDeleteProductMutation } from "../../../hooks/products";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

type DeleteProductModalProps = {
  open: boolean;
  productId: number;
  productName: string;
  onClose: () => void;
  onDeleted: () => void;
};

export const DeleteProductModal = ({
  open,
  productId,
  productName,
  onClose,
  onDeleted,
}: DeleteProductModalProps) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteProductMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setErrorMessage(null);

    const result = await deleteMutation.mutateAsync(productId);

    result.match(
      () => {
        onClose();
        onDeleted();
      },
      (error) => {
        setErrorMessage(getApiErrorMessage(error) ?? t("common.errors.error"));
      },
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={t("pages.productDetails.productModals.delete.title")}
      actions={
        <>
          <Button onClick={onClose} color="inherit" disabled={deleteMutation.isLoading}>
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isLoading}
            startIcon={
              deleteMutation.isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {deleteMutation.isLoading
              ? `${t("common.actions.deleting")}...`
              : t("common.actions.delete")}
          </Button>
        </>
      }
    >
      <Typography>
        {t("pages.productDetails.productModals.delete.confirmation", {
          name: productName,
        })}
      </Typography>
      {errorMessage ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      ) : null}
    </BaseModal>
  );
};

