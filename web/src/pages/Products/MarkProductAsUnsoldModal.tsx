import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, CircularProgress, Typography } from "@mui/material";
import { BaseModal } from "../../components/BaseModal/BaseModal";
import { useMarkProductAsUnsoldMutation } from "../../hooks/products";
import { translateError } from "../../utils/translateError";

type Props = {
  open: boolean;
  productId: number;
  onClose: () => void;
};

export const MarkProductAsUnsoldModal: FC<Props> = ({
  open,
  productId,
  onClose,
}) => {
  const { t } = useTranslation();
  const unsoldMutation = useMarkProductAsUnsoldMutation();

  const handleConfirm = async () => {
    const result = await unsoldMutation.mutateAsync(productId);
    result.match(
      () => onClose(),
      (error) => console.error(translateError(error)),
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={t("pages.productDetails.productModals.markUnsold.title")}
      actions={
        <>
          <Button onClick={onClose} color="inherit">
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={unsoldMutation.isLoading}
            startIcon={
              unsoldMutation.isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {t("pages.productDetails.actions.markAsUnsold")}
          </Button>
        </>
      }
    >
      <Typography>
        {t("pages.productDetails.productModals.markUnsold.confirmation")}
      </Typography>
    </BaseModal>
  );
};
