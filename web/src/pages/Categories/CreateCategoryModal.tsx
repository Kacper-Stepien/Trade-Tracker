import { FC, useState } from "react";
import { useCreateCategoryMutation } from "../../hooks/categories";
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
  open: boolean;
  onClose: () => void;
}

export const CreateCategoryModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const createMutation = useCreateCategoryMutation();

  const handleClose = () => {
    createMutation.reset();
    setFormError(null);
    setName("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setFormError(null);
    const result = await createMutation.mutateAsync(name.trim());
    result.match(
      () => handleClose(),
      (error) => setFormError(translateError(error)),
    );
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={t("pages.categories.addModal.title")}
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!name.trim() || createMutation.isLoading}
            startIcon={
              createMutation.isLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            {t("common.actions.create")}
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
        {t("pages.categories.addModal.label")}
      </Typography>
      <TextField
        autoFocus
        fullWidth
        placeholder={t("pages.categories.addModal.placeholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
    </BaseModal>
  );
};
