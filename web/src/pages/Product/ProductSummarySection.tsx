import {
  alpha,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useTranslation } from "react-i18next";
import { Product, ProductCost } from "../../types/Product";
import { formatDate, formatPrice } from "../../utils/formatters";
import { PRODUCT_STATUS_COLORS } from "../../utils/themes/themes";
import { EditProductFocusField } from "./modals/EditProductModal";
import { MarkProductAsSoldFocusField } from "./modals/MarkProductAsSoldModal";

type ProductSummarySectionProps = {
  product: Product;
  costs: ProductCost[];
  locale: string;
  onEditProduct: (field: EditProductFocusField) => void;
  onMarkAsSold: (field: MarkProductAsSoldFocusField) => void;
  onMarkAsUnsold: () => void;
};

const toSafeNumber = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

export const ProductSummarySection = ({
  product,
  costs,
  locale,
  onEditProduct,
  onMarkAsSold,
  onMarkAsUnsold,
}: ProductSummarySectionProps) => {
  const { t } = useTranslation();

  const totalCosts = costs.reduce(
    (sum, cost) => sum + toSafeNumber(cost.price),
    0,
  );
  const purchasePrice = toSafeNumber(product.purchasePrice);
  const salePrice = toSafeNumber(product.salePrice);

  const profit =
    product.sold && product.salePrice !== null
      ? salePrice - purchasePrice - totalCosts
      : null;
  const isProfit = product.sold && (profit ?? 0) >= 0;

  const saleCardColor = !product.sold
    ? PRODUCT_STATUS_COLORS.unsold
    : isProfit
      ? PRODUCT_STATUS_COLORS.sold
      : PRODUCT_STATUS_COLORS.loss;

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
      <Box display="flex" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700}>
          {t("pages.productDetails.sections.summary")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "action.hover",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box display="flex" flexDirection="column" gap={1.5}>
            <InfoRow
              label={t("pages.addProduct.fields.name")}
              value={product.name}
              onEdit={() => onEditProduct("name")}
            />
            <Divider />
            <InfoRow
              label={t("pages.productDetails.fields.category")}
              value={product.category?.name ?? "-"}
              onEdit={() => onEditProduct("categoryId")}
            />
            <Divider />
            <InfoRow
              label={t("pages.productDetails.fields.purchasePrice")}
              value={formatPrice(product.purchasePrice, locale)}
              onEdit={() => onEditProduct("purchasePrice")}
              highlight
            />
            <Divider />
            <InfoRow
              label={t("pages.productDetails.fields.purchaseDate")}
              value={formatDate(product.purchaseDate, locale)}
              onEdit={() => onEditProduct("purchaseDate")}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(saleCardColor, 0.12),
            border: "1px solid",
            borderColor: alpha(saleCardColor, 0.35),
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box display="flex" flexDirection="column" gap={1.5} sx={{ flexGrow: 1 }}>
            <InfoRow
              label={t("pages.productDetails.fields.salePrice")}
              value={formatPrice(product.sold ? product.salePrice : null, locale)}
              onEdit={product.sold ? () => onMarkAsSold("salePrice") : undefined}
              highlight={product.sold}
              accentColor={saleCardColor}
            />
            <Divider />
            <InfoRow
              label={t("pages.productDetails.fields.saleDate")}
              value={formatDate(product.sold ? product.saleDate : null, locale)}
              onEdit={product.sold ? () => onMarkAsSold("saleDate") : undefined}
              highlight={product.sold}
              accentColor={saleCardColor}
            />

            <Box mt="auto" pt={2}>
              <Button
                fullWidth
                variant={product.sold ? "outlined" : "contained"}
                color={product.sold ? "inherit" : "primary"}
                onClick={
                  product.sold ? onMarkAsUnsold : () => onMarkAsSold("salePrice")
                }
                sx={{
                  py: 1.5,
                  borderRadius: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  ...(product.sold ? { borderColor: "divider" } : {}),
                }}
              >
                {product.sold
                  ? t("pages.productDetails.actions.markAsUnsold")
                  : t("pages.productDetails.actions.markAsSold")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

const InfoRow = ({
  label,
  value,
  onEdit,
  highlight = false,
  accentColor,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
  highlight?: boolean;
  accentColor?: string;
}) => (
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: -0.5 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        fontWeight={highlight ? 800 : 500}
        sx={{ color: highlight && accentColor ? accentColor : "text.primary" }}
      >
        {value}
      </Typography>
    </Box>
    {onEdit ? (
      <IconButton
        size="small"
        onClick={onEdit}
        sx={{ opacity: 0.6, "&:hover": { opacity: 1, bgcolor: "transparent" } }}
      >
        <EditOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    ) : null}
  </Box>
);

