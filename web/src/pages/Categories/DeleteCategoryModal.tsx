import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDeleteCategoryMutation } from "../../hooks/categories";
import { Category } from "../../types/Category.type";
import { translateError } from "../../utils/translateError";
import { FC } from "react";
import { BaseModal } from "../../components/BaseModal/BaseModal";

interface Props {
  category: Category | null;
  onClose: () => void;
}

export const DeleteCategoryModal: FC<Props> = ({ category, onClose }) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteCategoryMutation();

  const handleConfirm = async () => {
    if (!category) return;

    const result = await deleteMutation.mutateAsync(category.id);

    result.match(
      () => onClose(),
      (error) => {
        console.error(translateError(error));
      },
    );
  };

  return (
    <BaseModal
      open={!!category}
      onClose={onClose}
      title={t("pages.categories.deleteModal.title")}
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
        {t("pages.categories.deleteModal.confirmation")} "{category?.name}"?
      </Typography>
    </BaseModal>
  );
};
