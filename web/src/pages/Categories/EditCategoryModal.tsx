import { useEffect, useState } from "react";
import { Category } from "../../types/Category.type";
import { useUpdateCategoryMutation } from "../../hooks/categories";
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
  category: Category | null;
  onClose: () => void;
}

export const EditCategoryModal = ({ category, onClose }: Props) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const updateMutation = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleClose = () => {
    updateMutation.reset();
    setFormError(null);
    setName("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!category || !name.trim()) return;
    setFormError(null);
    const result = await updateMutation.mutateAsync({
      id: category.id,
      name: name.trim(),
    });
    result.match(
      () => handleClose(),
      (error) => setFormError(translateError(error)),
    );
  };

  return (
    <BaseModal
      open={!!category}
      onClose={handleClose}
      title={t("pages.categories.editModal.title")}
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
        {t("pages.categories.editModal.label")}
      </Typography>
      <TextField
        autoFocus
        fullWidth
        placeholder={t("pages.categories.editModal.placeholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
    </BaseModal>
  );
};
