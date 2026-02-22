import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
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
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useCostTypesPaginatedQuery } from "../../hooks/cost_types";
import { CostType } from "../../types/CostType.type";
import { CreateCostTypeModal } from "./CreateCostTypeModal";
import { useUserStore } from "../../store/userStore";
import { EditCostTypeModal } from "./EditCostTypeModal";
import { DeleteCostTypeModal } from "./DeleteCostTypeModal";
import { PageLoader } from "../../components/PageLoader/PageLoader";
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={4}
        flexShrink={0}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {t("pages.costTypes.title")}
          </Typography>
          <Typography variant="body2">
            {t("pages.costTypes.description")}
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            {t("common.actions.add")}
          </Button>
        )}
      </Box>

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
                        <IconButton onClick={() => setEditingCostType(costType)}>
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
          labelRowsPerPage={t("pages.costTypes.pagination.rowsPerPage")}
          labelDisplayedRows={({ from, to, count }) =>
            t("pages.costTypes.pagination.displayedRows", {
              from,
              to,
              total: count === -1 ? `>${to}` : count,
            })
          }
        />
      </Paper>

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
