import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
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
import { useCostTypesPaginatedQuery } from "../../hooks/cost_types";
import { CostType } from "../../types/CostType.type";
import { CreateCostTypeModal } from "./modals/CreateCostTypeModal";
import { useUserStore } from "../../store/userStore";
import { EditCostTypeModal } from "./modals/EditCostTypeModal";
import { DeleteCostTypeModal } from "./modals/DeleteCostTypeModal";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { DataTableContainer } from "../../components/DataTable/DataTableContainer";
import { DataTableLayout } from "../../components/DataTable/DataTableLayout";
import { usePagination } from "../../hooks/usePagination";
import { TABLE_ROWS_PER_PAGE_OPTIONS } from "../../constants/pagination";

const CostTypesPage: FC = () => {
  const { t } = useTranslation();
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange } =
    usePagination();
  const { data, isLoading, isError } = useCostTypesPaginatedQuery({
    page: page + 1,
    limit: rowsPerPage,
  });
  const costTypes = data?.costTypes ?? [];
  const userRole = useUserStore((state) => state.user?.role);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCostType, setEditingCostType] = useState<CostType | null>(null);
  const [deletingCostType, setDeletingCostType] = useState<CostType | null>(
    null,
  );

  const isAdmin = userRole === "admin";

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
        title={t("pages.costTypes.title")}
        description={t("pages.costTypes.description")}
        action={
          isAdmin ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateModalOpen(true)}
              sx={{ alignSelf: "flex-end" }}
            >
              {t("common.actions.add")}
            </Button>
          ) : null
        }
      />

      <DataTableContainer
        pagination={
          <TablePagination
            component="div"
            count={data?.total ?? 0}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={TABLE_ROWS_PER_PAGE_OPTIONS}
            labelRowsPerPage={t("pages.costTypes.pagination.rowsPerPage")}
            labelDisplayedRows={({ from, to, count }) =>
              t("pages.costTypes.pagination.displayedRows", {
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
                  {t("pages.costTypes.table.name")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.costTypes.table.costsCount")}
                </TableCell>
                {isAdmin && (
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {t("pages.costTypes.table.actions")}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {costTypes.length ? (
                costTypes.map((costType) => (
                  <TableRow
                    key={costType.id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>{costType.name}</TableCell>
                    <TableCell>{costType.costsCount}</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <IconButton
                          onClick={() => setEditingCostType(costType)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => setDeletingCostType(costType)}
                          color="error"
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 3 : 2} align="center">
                    {t("pages.costTypes.table.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </DataTableLayout>
      </DataTableContainer>

      {isAdmin && (
        <>
          <CreateCostTypeModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
          <EditCostTypeModal
            costType={editingCostType}
            onClose={() => setEditingCostType(null)}
          />
          <DeleteCostTypeModal
            costType={deletingCostType}
            onClose={() => setDeletingCostType(null)}
          />
        </>
      )}
    </Box>
  );
};

export default CostTypesPage;
