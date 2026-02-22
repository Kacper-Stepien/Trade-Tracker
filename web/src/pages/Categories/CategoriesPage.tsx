import {
  Alert,
  Box,
  Button,
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
import { useCategoriesQuery } from "../../hooks/categories";
import { useState } from "react";
import { Category } from "../../types/Category.type";
import { useTranslation } from "react-i18next";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";
import { PageLoader } from "../../components/PageLoader/PageLoader";

export const CategoriesPage = () => {
  const { t } = useTranslation();
  const { data: categories, isLoading, isError } = useCategoriesQuery();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );

  if (isLoading) {
    return <PageLoader />;
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
          <Typography variant="body2">
            {t("pages.categories.description")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateModalOpen(true)}
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
                    <IconButton onClick={() => setEditingCategory(category)}>
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setDeletingCategory(category)}
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

      <CreateCategoryModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditCategoryModal
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
      />

      <DeleteCategoryModal
        category={deletingCategory}
        onClose={() => setDeletingCategory(null)}
      />
    </Box>
  );
};
