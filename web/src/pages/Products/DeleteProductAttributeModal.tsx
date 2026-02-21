import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, CircularProgress, Typography } from "@mui/material";
import { BaseModal } from "../../components/BaseModal/BaseModal";
import { ProductAttribute } from "../../types/Product";
import { useDeleteProductAttributeMutation } from "../../hooks/product_attributes";
import { translateError } from "../../utils/translateError";

type Props = {
  productId: number;
  attribute: ProductAttribute | null;
  onClose: () => void;
};

export const DeleteProductAttributeModal: FC<Props> = ({
  productId,
  attribute,
  onClose,
}) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteProductAttributeMutation();

  const handleConfirm = async () => {
    if (!attribute) return;
    const result = await deleteMutation.mutateAsync({
      productId,
      attributeId: attribute.id,
    });
    result.match(
      () => onClose(),
      (error) => console.error(translateError(error)),
    );
  };

  return (
    <BaseModal
      open={!!attribute}
      onClose={onClose}
      title={t("pages.productDetails.attributes.deleteModal.title")}
      actions={
        <>
          <Button onClick={onClose} color="inherit">
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
        {t("pages.productDetails.attributes.deleteModal.confirmation")} "
        {attribute?.name}"?
      </Typography>
    </BaseModal>
  );
};
