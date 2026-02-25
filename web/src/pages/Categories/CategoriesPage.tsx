import {
  Box,
  Button,
  IconButton,
  TableBody,
  TableCell,
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
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { DataTableContainer } from "../../components/DataTable/DataTableContainer";
import { DataTableLayout } from "../../components/DataTable/DataTableLayout";
import { AsyncStateBoundary } from "../../components/AsyncStateBoundary/AsyncStateBoundary";
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

  return (
    <AsyncStateBoundary
      data={data}
      isLoading={isLoading}
      isError={isError}
      errorMessage={t("common.errors.fetchFailed")}
    >
      {(resolvedData) => (
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

          <DataTableContainer
            pagination={
              <TablePagination
                component="div"
                count={resolvedData.total}
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
            }
          >
            <DataTableLayout
              tableContainerSx={{
                flex: 1,
                minHeight: 0,
                overflowY: "scroll",
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
              {resolvedData.categories.length ? (
                resolvedData.categories.map((category) => (
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
            </DataTableLayout>
          </DataTableContainer>

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
      )}
    </AsyncStateBoundary>
  );
};
