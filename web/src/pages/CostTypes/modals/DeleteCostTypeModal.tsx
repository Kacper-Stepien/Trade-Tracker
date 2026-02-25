import { useTranslation } from "react-i18next";
import { useDeleteCostTypeMutation } from "../../../hooks/cost_types";
import { CostType } from "../../../types/CostType.type";
import { translateError } from "../../../utils/translateError";
import { FC } from "react";
import { EntityDeleteModal } from "../../../components/entity-modals/EntityDeleteModal";

interface Props {
  costType: CostType | null;
  onClose: () => void;
}

export const DeleteCostTypeModal: FC<Props> = ({ costType, onClose }) => {
  const { t } = useTranslation();
  const deleteMutation = useDeleteCostTypeMutation();

  const handleClose = () => {
    deleteMutation.reset();
    onClose();
  };

  const handleConfirm = async () => {
    if (!costType) {
      return t("common.errors.error");
    }
    const result = await deleteMutation.mutateAsync(costType.id);

    return result.match(
      () => null,
      (error) => translateError(error),
    );
  };

  return (
    <EntityDeleteModal
      open={!!costType}
      onClose={handleClose}
      title={t("pages.costTypes.deleteModal.title")}
      confirmationText={t("pages.costTypes.deleteModal.confirmation")}
      entityName={costType?.name}
      isSubmitting={deleteMutation.isLoading}
      onConfirm={handleConfirm}
      disableConfirm={!costType}
    />
  );
};
