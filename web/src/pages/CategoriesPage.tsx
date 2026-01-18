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
import { AxiosError } from "axios";
import { Category } from "../types/Category.type";

interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export const CategoriesPage = () => {
  const { data: categories, isLoading, isError } = useCategoriesQuery();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    createMutation.reset();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    createMutation.reset();
    setIsModalOpen(false);
  };

  const handleCreate = (name: string) => {
    createMutation.mutate(name, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    updateMutation.reset();
  };

  const handleEditSubmit = (name: string) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, name },
        { onSuccess: () => setEditingCategory(null) },
      );
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleDeleteConfirm = () => {
    if (deletingCategory) {
      deleteMutation.mutate(deletingCategory.id, {
        onSuccess: () => setDeletingCategory(null),
      });
    }
  };

  const getErrorMessage = (error: unknown): string | null => {
    if (!error) return null;
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.message || "An error occurred";
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
    return <Alert severity="error">Nie udało się pobrać kategorii</Alert>;
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
            Categories
          </Typography>
          <Typography variant="body2" color="text.">
            Manage your product categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Add Category
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 4 }} elevation={0}>
        <Box sx={{ px: 4, py: 6 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
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
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreate}
        isLoading={createMutation.isLoading}
        mode="create"
        error={getErrorMessage(createMutation.error)}
      />
      <CategoryModal
        open={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isLoading}
        initialName={editingCategory?.name || ""}
        mode="edit"
        error={getErrorMessage(updateMutation.error)}
      />
      <Dialog
        open={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{deletingCategory?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingCategory(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
