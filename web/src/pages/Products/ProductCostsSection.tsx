import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  Chip,
  Tooltip,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useTranslation } from "react-i18next";
import { ProductCost } from "../../types/Product";
import { formatDate, formatPrice } from "../../utils/formatters";

type ProductCostsSectionProps = {
  costs: ProductCost[];
  locale: string;
  onCreate: () => void;
  onEdit: (cost: ProductCost) => void;
  onDelete: (cost: ProductCost) => void;
};

export const ProductCostsSection = ({
  costs,
  locale,
  onCreate,
  onEdit,
  onDelete,
}: ProductCostsSectionProps) => {
  const { t } = useTranslation();
  const brandAccent = "#2dd4bf"; // Nasz cyjan/mięta

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        p: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <ReceiptLongOutlinedIcon
            sx={{ color: "text.secondary", fontSize: 20 }}
          />
          <Typography variant="h6" fontWeight={700}>
            {t("pages.productDetails.sections.costs", "Koszty dodatkowe")}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onCreate}
          sx={{
            borderRadius: 1.5,
            bgcolor: brandAccent,
            color: "black",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "#0d9488" },
          }}
        >
          {t("pages.productDetails.costs.actions.add", "Dodaj koszt")}
        </Button>
      </Box>

      {!costs.length ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography color="text.secondary">
            {t(
              "pages.productDetails.empty.costs",
              "Brak zarejestrowanych kosztów",
            )}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {costs.map((cost) => (
            <Box
              key={cost.id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                border: 1,
                borderColor: "transparent",
                transition: "0.2s",
                "&:hover": {
                  borderColor: "divider",
                  bgcolor: "background.default",
                },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
              }}
            >
              <Box display="flex" gap={2} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{ color: brandAccent }}
                  >
                    $
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body1" fontWeight={700}>
                    {cost.name}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mt={0.5}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(cost.date, locale)}
                    </Typography>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ height: 12, my: "auto" }}
                    />
                    <Chip
                      label={cost.costType?.name ?? "Inne"}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        bgcolor: "action.selected",
                      }}
                    />
                  </Stack>
                </Box>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: "100%", sm: "auto" }, gap: 3 }}
              >
                <Box textAlign={{ xs: "left", sm: "right" }}>
                  <Typography variant="h6" fontWeight={800}>
                    {formatPrice(cost.price, locale)}
                  </Typography>
                  {cost.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      sx={{ maxWidth: 150, display: "block" }}
                    >
                      {cost.description}
                    </Typography>
                  )}
                </Box>

                <Box display="flex" gap={0.5}>
                  <Tooltip title={t("common.actions.edit")}>
                    <IconButton size="small" onClick={() => onEdit(cost)}>
                      <EditOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("common.actions.delete")}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(cost)}
                    >
                      <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
};
