import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../hooks/categories";
import { useState } from "react";
import { CategoryModal } from "../components/CategoryModal/CategoryModal";
import { Category } from "../types/Category.type";
import { useTranslation } from "react-i18next";
import { translateError } from "../utils/translateError";

export const CategoriesPage = () => {
  const { t } = useTranslation();
  const { data: categories, isLoading, isError } = useCategoriesQuery();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [createFormError, setCreateFormError] = useState<string | null>(null);
  const [updateFormError, setUpdateFormError] = useState<string | null>(null);

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const handleOpenModal = () => {
    createMutation.reset();
    setCreateFormError(null);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    createMutation.reset();
    setIsEditModalOpen(false);
    setCreateFormError(null);
  };

  const handleCreate = async (name: string) => {
    setCreateFormError(null);
    const result = await createMutation.mutateAsync(name);

    result.match(
      () => {
        handleCloseModal();
      },
      (error) => {
        setCreateFormError(translateError(error));
      },
    );
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setUpdateFormError(null);
    updateMutation.reset();
  };

  const handleEditSubmit = async (name: string) => {
    if (!editingCategory) return;

    setUpdateFormError(null);
    const result = await updateMutation.mutateAsync({
      id: editingCategory.id,
      name,
    });

    result.match(
      () => setEditingCategory(null),
      (error) => {
        setUpdateFormError(translateError(error));
      },
    );
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    const result = await deleteMutation.mutateAsync(deletingCategory.id);

    result.match(
      () => setDeletingCategory(null),
      (error) => {
        // Tu można dodać np. toast z błędem, jeśli usuwanie się nie powiodło
        console.error(translateError(error));
      },
    );
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">{t("common.errors.fetchFailed")}</Alert>;
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {t("pages.categories.title")}
          </Typography>
          <Typography variant="body2" color="text.">
            {t("pages.categories.description")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          {t("common.actions.add")}
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }} elevation={0}>
        <Box sx={{ px: 2, py: 6 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("pages.categories.table.name")}</TableCell>
                <TableCell align="right">
                  {t("pages.categories.table.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEditClick(category)}>
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(category)}
                      color="error"
                    >
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
      <CategoryModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreate}
        isLoading={createMutation.isLoading}
        mode="create"
        error={createFormError}
      />
      <CategoryModal
        open={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isLoading}
        initialName={editingCategory?.name || ""}
        mode="edit"
        error={updateFormError}
      />
      <Dialog
        open={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
      >
        <DialogTitle>{t("pages.categories.deleteModal.title")}</DialogTitle>
        <DialogContent>
          {t("pages.categories.deleteModal.confirmation")} "
          {deletingCategory?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingCategory(null)}>
            {t("common.actions.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading
              ? `${t("common.actions.deleting")}...`
              : t("common.actions.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
