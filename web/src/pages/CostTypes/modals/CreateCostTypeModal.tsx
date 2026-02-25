import { FC } from "react";
import { translateError } from "../../../utils/translateError";
import { useTranslation } from "react-i18next";
import { useCreateCostTypeMutation } from "../../../hooks/cost_types";
import { EntityNameModal } from "../../../components/entity-modals/EntityNameModal";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateCostTypeModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const createMutation = useCreateCostTypeMutation();

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
      title={t("pages.costTypes.addModal.title")}
      label={t("pages.costTypes.addModal.label")}
      placeholder={t("pages.costTypes.addModal.placeholder")}
      submitLabel={t("common.actions.create")}
      isSubmitting={createMutation.isLoading}
      onSubmit={handleSubmit}
    />
  );
};
