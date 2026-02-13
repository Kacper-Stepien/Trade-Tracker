import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import { useCostTypesQuery } from "../../hooks/cost_types";
import { CostType } from "../../types/CostType.type";
import { CreateCostTypeModal } from "./CreateCostTypeModal";
import { useUserStore } from "../../store/userStore";
import { EditCostTypeModal } from "./EditCostTypeModal";
import { DeleteCostTypeModal } from "./DeleteCostTypeModal";

const CostTypesPage: FC = () => {
  const { t } = useTranslation();
  const { data: costTypes, isLoading, isError } = useCostTypesQuery();
  const userRole = useUserStore((state) => state.user?.role);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCostType, setEditingCostType] = useState<CostType | null>(null);
  const [deletingCostType, setDeletingCostType] = useState<CostType | null>(
    null,
  );

  const isAdmin = userRole === "admin";

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

      <TableContainer component={Paper} sx={{ borderRadius: 2 }} elevation={0}>
        <Box sx={{ px: 2, py: 6 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("pages.costTypes.table.name")}</TableCell>
                {isAdmin && (
                  <TableCell align="right">
                    {t("pages.costTypes.table.actions")}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {costTypes?.map((costType) => (
                <TableRow key={costType.id}>
                  <TableCell>{costType.name}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>

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
