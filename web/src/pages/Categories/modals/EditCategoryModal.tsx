import { Category } from "../../../types/Category.type";
import { useUpdateCategoryMutation } from "../../../hooks/categories";
import { translateError } from "../../../utils/translateError";
import { useTranslation } from "react-i18next";
import { EntityNameModal } from "../../../components/entity-modals/EntityNameModal";

interface Props {
  category: Category | null;
  onClose: () => void;
}

export const EditCategoryModal = ({ category, onClose }: Props) => {
  const { t } = useTranslation();
  const updateMutation = useUpdateCategoryMutation();

  const handleClose = () => {
    updateMutation.reset();
    onClose();
  };

  const handleSubmit = async (name: string) => {
    if (!category) {
      return t("common.errors.error");
    }

    const result = await updateMutation.mutateAsync({
      id: category.id,
      name,
    });
    return result.match(
      () => null,
      (error) => translateError(error),
    );
  };

  return (
    <EntityNameModal
      open={!!category}
      onClose={handleClose}
      title={t("pages.categories.editModal.title")}
      label={t("pages.categories.editModal.label")}
      placeholder={t("pages.categories.editModal.placeholder")}
      submitLabel={t("common.actions.save")}
      isSubmitting={updateMutation.isLoading}
      initialValue={category?.name ?? ""}
      onSubmit={handleSubmit}
    />
  );
};
