import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDeleteCostTypeMutation } from "../../hooks/cost_types";
import { CostType } from "../../types/CostType.type";
import { translateError } from "../../utils/translateError";
import { FC, useState } from "react";
import { BaseModal } from "../../components/BaseModal/BaseModal";

interface Props {
  costType: CostType | null;
  onClose: () => void;
}

export const DeleteCostTypeModal: FC<Props> = ({ costType, onClose }) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteCostTypeMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const handleClose = () => {
    deleteMutation.reset();
    setFormError(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!costType) return;

    setFormError(null);
    const result = await deleteMutation.mutateAsync(costType.id);

    result.match(
      () => handleClose(),
      (error) => {
        setFormError(translateError(error));
      },
    );
  };

  return (
    <BaseModal
      open={!!costType}
      onClose={handleClose}
      title={t("pages.costTypes.deleteModal.title")}
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
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
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      <Typography>
        {t("pages.costTypes.deleteModal.confirmation")} "{costType?.name}"?
      </Typography>
    </BaseModal>
  );
};
