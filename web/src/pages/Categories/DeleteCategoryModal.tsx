import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDeleteCategoryMutation } from "../../hooks/categories";
import { Category } from "../../types/Category.type";
import { translateError } from "../../utils/translateError";
import { FC, useState } from "react";
import { BaseModal } from "../../components/BaseModal/BaseModal";

interface Props {
  category: Category | null;
  onClose: () => void;
}

export const DeleteCategoryModal: FC<Props> = ({ category, onClose }) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteCategoryMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const handleClose = () => {
    deleteMutation.reset();
    setFormError(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (!category) return;

    setFormError(null);
    const result = await deleteMutation.mutateAsync(category.id);

    result.match(
      () => handleClose(),
      (error) => {
        setFormError(translateError(error));
      },
    );
  };

  return (
    <BaseModal
      open={!!category}
      onClose={handleClose}
      title={t("pages.categories.deleteModal.title")}
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
        {t("pages.categories.deleteModal.confirmation")} "{category?.name}"?
      </Typography>
    </BaseModal>
  );
};
