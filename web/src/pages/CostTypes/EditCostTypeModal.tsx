import { useEffect, useState } from "react";
import { CostType } from "../../types/CostType.type";
import { useUpdateCostTypeMutation } from "../../hooks/cost_types";
import { translateError } from "../../utils/translateError";
import { useTranslation } from "react-i18next";
import { BaseModal } from "../../components/BaseModal/BaseModal";
import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

interface Props {
  costType: CostType | null;
  onClose: () => void;
}

export const EditCostTypeModal = ({ costType, onClose }: Props) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const updateMutation = useUpdateCostTypeMutation();

  useEffect(() => {
    if (costType) {
      setName(costType.name);
    }
  }, [costType]);

  const handleClose = () => {
    updateMutation.reset();
    setFormError(null);
    setName("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!costType || !name.trim()) return;
    setFormError(null);
    const result = await updateMutation.mutateAsync({
      id: costType.id,
      name: name.trim(),
    });
    result.match(
      () => handleClose(),
      (error) => setFormError(translateError(error)),
    );
  };

  return (
    <BaseModal
      open={!!costType}
      onClose={handleClose}
      title={t("pages.costTypes.editModal.title")}
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!name.trim() || updateMutation.isLoading}
            startIcon={
              updateMutation.isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {t("common.actions.save")}
          </Button>
        </>
      }
    >
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      <Typography variant="body2" mb={1}>
        {t("pages.costTypes.editModal.label")}
      </Typography>
      <TextField
        autoFocus
        fullWidth
        placeholder={t("pages.costTypes.editModal.placeholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
    </BaseModal>
  );
};
