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
  TablePagination,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useCategoriesPaginatedQuery } from "../../hooks/categories";
import { useState } from "react";
import { Category } from "../../types/Category.type";
import { useTranslation } from "react-i18next";
import { CreateCategoryModal } from "./modals/CreateCategoryModal";
import { EditCategoryModal } from "./modals/EditCategoryModal";
import { DeleteCategoryModal } from "./modals/DeleteCategoryModal";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { usePagination } from "../../hooks/usePagination";
import { TABLE_ROWS_PER_PAGE_OPTIONS } from "../../constants/pagination";

export const CategoriesPage = () => {
  const { t } = useTranslation();
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange } =
    usePagination();
  const { data, isLoading, isError } = useCategoriesPaginatedQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

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
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <PageHeader
        title={t("pages.categories.title")}
        description={t("pages.categories.description")}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
            sx={{ alignSelf: "flex-end" }}
          >
            {t("common.actions.add")}
          </Button>
        }
      />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "scroll",
            overflowX: "auto",
            boxShadow: "inset 0 6px 6px -8px rgba(0,0,0,0.35)",
          }}
        >
          <Table
            stickyHeader
            sx={{
              "& .MuiTableCell-stickyHeader": {
                backgroundColor: "background.paper",
                zIndex: 2,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.categories.table.name")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.categories.table.productsCount")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {t("pages.categories.table.actions")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.categories.length ? (
                data.categories.map((category) => (
                  <TableRow
                    key={category.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.productsCount}</TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    {t("pages.categories.table.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={data?.total ?? 0}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={TABLE_ROWS_PER_PAGE_OPTIONS}
          labelRowsPerPage={t("pages.categories.pagination.rowsPerPage")}
          labelDisplayedRows={({ from, to, count }) =>
            t("pages.categories.pagination.displayedRows", {
              from,
              to,
              total: count === -1 ? `>${to}` : count,
            })
          }
        />
      </Paper>

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
