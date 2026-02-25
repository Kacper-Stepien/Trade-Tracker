import { useTranslation } from "react-i18next";
import { useDeleteCategoryMutation } from "../../../hooks/categories";
import { Category } from "../../../types/Category.type";
import { translateError } from "../../../utils/translateError";
import { FC } from "react";
import { EntityDeleteModal } from "../../../components/entity-modals/EntityDeleteModal";

interface Props {
  category: Category | null;
  onClose: () => void;
}

export const DeleteCategoryModal: FC<Props> = ({ category, onClose }) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteCategoryMutation();

  const handleClose = () => {
    deleteMutation.reset();
    onClose();
  };

  const handleConfirm = async () => {
    if (!category) {
      return t("common.errors.error");
    }
    const result = await deleteMutation.mutateAsync(category.id);

    return result.match(
      () => null,
      (error) => translateError(error),
    );
  };

  return (
    <EntityDeleteModal
      open={!!category}
      onClose={handleClose}
      title={t("pages.categories.deleteModal.title")}
      confirmationText={t("pages.categories.deleteModal.confirmation")}
      entityName={category?.name}
      isSubmitting={deleteMutation.isLoading}
      onConfirm={handleConfirm}
      disableConfirm={!category}
    />
  );
};
