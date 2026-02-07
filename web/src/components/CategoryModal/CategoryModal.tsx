import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

type CategoryModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading?: boolean;
  initialName?: string;
  mode: "create" | "edit";
  error?: string | null;
};

export const CategoryModal = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  initialName = "",
  mode,
  error,
}: CategoryModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, open]);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 0,
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {mode === "create"
              ? t("pages.categories.addModal.title")
              : t("pages.categories.editModal.title")}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="body2" mb={1}>
          {mode === "create"
            ? t("pages.categories.addModal.label")
            : t("pages.categories.editModal.label")}
        </Typography>
        <TextField
          autoFocus
          fullWidth
          placeholder={
            mode === "create"
              ? t("pages.categories.addModal.placeholder")
              : t("pages.categories.editModal.placeholder")
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim() || isLoading}
          startIcon={
            isLoading ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {mode === "create"
            ? t("common.actions.create")
            : t("common.actions.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
