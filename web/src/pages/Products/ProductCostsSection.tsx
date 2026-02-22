import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTranslation } from "react-i18next";
import { ProductCost } from "../../types/Product";
import { formatDate, formatPrice } from "../../utils/formatters";
import { PRODUCT_STATUS_COLORS } from "../../utils/themes/themes";

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
  const costIconColor = PRODUCT_STATUS_COLORS.loss;

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
        <Typography variant="h6" fontWeight={700}>
          {t("pages.productDetails.sections.costs")}
        </Typography>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onCreate}
        >
          {t("pages.productDetails.costs.actions.add")}
        </Button>
      </Box>

      {!costs.length ? (
        <Typography color="text.secondary">
          {t("pages.productDetails.empty.costs")}
        </Typography>
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
                borderColor: "divider",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "background.default",
                },
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box
                display="flex"
                gap={2}
                alignItems="flex-start"
                flex={1}
                minWidth={0}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    bgcolor: alpha(costIconColor, 0.14),
                    border: `1px solid ${alpha(costIconColor, 0.35)}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={800}
                    sx={{ color: costIconColor }}
                  >
                    $
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body1" fontWeight={700} noWrap>
                    {cost.name}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mt={0.5}
                    flexWrap="wrap"
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
                      size="small"
                      label={cost.costType?.name ?? "-"}
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        bgcolor: "action.selected",
                        color: "text.secondary",
                        borderColor: "divider",
                      }}
                    />
                  </Stack>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.75, overflowWrap: "anywhere" }}
                  >
                    {cost.description ?? "-"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexShrink: 0,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{ minWidth: 96, textAlign: "right" }}
                >
                  {formatPrice(cost.price, locale)}
                </Typography>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", sm: "block" } }}
                />

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
