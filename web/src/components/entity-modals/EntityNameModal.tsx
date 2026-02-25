import { useEffect, useState } from "react";
import { Alert, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { BaseModal } from "../BaseModal/BaseModal";
import { useTranslation } from "react-i18next";

type EntityNameModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  isSubmitting: boolean;
  initialValue?: string;
  onSubmit: (value: string) => Promise<string | null>;
};

export const EntityNameModal = ({
  open,
  onClose,
  title,
  label,
  placeholder,
  submitLabel,
  isSubmitting,
  initialValue = "",
  onSubmit,
}: EntityNameModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialValue);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initialValue);
      setFormError(null);
    }
  }, [open, initialValue]);

  const handleClose = () => {
    setFormError(null);
    setName(initialValue);
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    setFormError(null);
    const errorMessage = await onSubmit(trimmedName);
    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }

    handleClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title={title}
      actions={
        <>
          <Button onClick={handleClose} color="inherit">
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!name.trim() || isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {submitLabel}
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
        {label}
      </Typography>
      <TextField
        autoFocus
        fullWidth
        placeholder={placeholder}
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
      />
    </BaseModal>
  );
};
