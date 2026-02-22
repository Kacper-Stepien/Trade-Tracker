import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, CircularProgress, Typography } from "@mui/material";
import { BaseModal } from "../../../components/BaseModal/BaseModal";
import { useDeleteProductCostMutation } from "../../../hooks/product_costs";
import { ProductCost } from "../../../types/Product";
import { translateError } from "../../../utils/translateError";

type Props = {
  productId: number;
  cost: ProductCost | null;
  onClose: () => void;
};

export const DeleteProductCostModal: FC<Props> = ({
  productId,
  cost,
  onClose,
}) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteProductCostMutation();

  const handleConfirm = async () => {
    if (!cost) return;
    const result = await deleteMutation.mutateAsync({
      id: cost.id,
      productId,
    });
    result.match(
      () => onClose(),
      (error) => console.error(translateError(error)),
    );
  };

  return (
    <BaseModal
      open={!!cost}
      onClose={onClose}
      title={t("pages.productDetails.costs.deleteModal.title")}
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
        {t("pages.productDetails.costs.deleteModal.confirmation")} "{cost?.name}
        "?
      </Typography>
    </BaseModal>
  );
};

