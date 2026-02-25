import { FC } from "react";
import { useCreateCategoryMutation } from "../../../hooks/categories";
import { translateError } from "../../../utils/translateError";
import { useTranslation } from "react-i18next";
import { EntityNameModal } from "../../../components/entity-modals/EntityNameModal";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateCategoryModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const createMutation = useCreateCategoryMutation();

  const handleClose = () => {
    createMutation.reset();
    onClose();
  };

  const handleSubmit = async (name: string) => {
    const result = await createMutation.mutateAsync(name);
    return result.match(
      () => null,
      (error) => translateError(error),
    );
  };

  return (
    <EntityNameModal
      open={open}
      onClose={handleClose}
      title={t("pages.categories.addModal.title")}
      label={t("pages.categories.addModal.label")}
      placeholder={t("pages.categories.addModal.placeholder")}
      submitLabel={t("common.actions.create")}
      isSubmitting={createMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
};
