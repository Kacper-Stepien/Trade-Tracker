import { useState } from "react";
import { Alert, Button, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BaseModal } from "../BaseModal/BaseModal";

type EntityDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  confirmationText: string;
  entityName?: string;
  isSubmitting: boolean;
  onConfirm: () => Promise<string | null>;
  disableConfirm?: boolean;
};

export const EntityDeleteModal = ({
  open,
  onClose,
  title,
  confirmationText,
  entityName,
  isSubmitting,
  onConfirm,
  disableConfirm = false,
}: EntityDeleteModalProps) => {
  const { t } = useTranslation();
  const [formError, setFormError] = useState<string | null>(null);

  const handleClose = () => {
    setFormError(null);
    onClose();
  };

  const handleConfirm = async () => {
    setFormError(null);
    const errorMessage = await onConfirm();

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
            onClick={handleConfirm}
            color="error"
            variant="contained"
            disabled={disableConfirm || isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {isSubmitting
              ? `${t("common.actions.deleting")}...`
              : t("common.actions.delete")}
          </Button>
        </>
      }
    >
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      <Typography>
        {confirmationText} "{entityName}"?
      </Typography>
    </BaseModal>
  );
};
