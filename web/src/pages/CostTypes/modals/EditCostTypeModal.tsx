import { CostType } from "../../../types/CostType.type";
import { useUpdateCostTypeMutation } from "../../../hooks/cost_types";
import { translateError } from "../../../utils/translateError";
import { useTranslation } from "react-i18next";
import { EntityNameModal } from "../../../components/entity-modals/EntityNameModal";

interface Props {
  costType: CostType | null;
  onClose: () => void;
}

export const EditCostTypeModal = ({ costType, onClose }: Props) => {
  const { t } = useTranslation();
  const updateMutation = useUpdateCostTypeMutation();

  const handleClose = () => {
    updateMutation.reset();
    onClose();
  };

  const handleSubmit = async (name: string) => {
    if (!costType) {
      return t("common.errors.error");
    }

    const result = await updateMutation.mutateAsync({
      id: costType.id,
      name,
    });
    return result.match(
      () => null,
      (error) => translateError(error),
    );
  };

  return (
    <EntityNameModal
      open={!!costType}
      onClose={handleClose}
      title={t("pages.costTypes.editModal.title")}
      label={t("pages.costTypes.editModal.label")}
      placeholder={t("pages.costTypes.editModal.placeholder")}
      submitLabel={t("common.actions.save")}
      isSubmitting={updateMutation.isLoading}
      initialValue={costType?.name ?? ""}
      onSubmit={handleSubmit}
    />
  );
};
