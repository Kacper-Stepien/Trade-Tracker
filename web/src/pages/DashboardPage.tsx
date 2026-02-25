import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { useUserStatsQuery } from "../hooks/stats";
import { useProductsQuery } from "../hooks/products";
import { formatPrice } from "../utils/formatters";
import { PRODUCT_STATUS_COLORS } from "../utils/themes/themes";
import { PageLoader } from "../components/PageLoader/PageLoader";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { KpiCard } from "../components/KpiCard/KpiCard";
import { ProductTable } from "../components/ProductTable/ProductTable";
import {
  formatPercentage,
  toFiniteNumberOrNull,
} from "../utils/number";

const DASHBOARD_PRODUCTS_LIMIT = 5;

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { data: stats, isLoading: isStatsLoading, isError: isStatsError } =
    useUserStatsQuery();
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProductsQuery({
    page: 1,
    limit: DASHBOARD_PRODUCTS_LIMIT,
  });

  const latestProducts = useMemo(() => {
    if (!productsData?.products) {
      return [];
    }

    return [...productsData.products].sort((a, b) => {
      const firstDate = new Date(a.purchaseDate).getTime();
      const secondDate = new Date(b.purchaseDate).getTime();
      return secondDate - firstDate;
    });
  }, [productsData]);

  if (isStatsLoading || isProductsLoading) {
    return <PageLoader />;
  }

  if (isStatsError || isProductsError || !stats) {
    return <Alert severity="error">{t("common.errors.fetchFailed")}</Alert>;
  }

  const profitColor =
    stats.totalProfit >= 0
      ? PRODUCT_STATUS_COLORS.sold
      : PRODUCT_STATUS_COLORS.loss;
  const realizedMarginColor =
    (stats.soldProductsProfitPercentage ?? 0) >= 0
      ? PRODUCT_STATUS_COLORS.sold
      : PRODUCT_STATUS_COLORS.loss;
  const frozenCapital = stats.totalCosts - stats.soldProductsCosts;
  const averageProfitPerSoldProduct =
    stats.numberOfSoldProducts > 0
      ? stats.soldProductsProfit / stats.numberOfSoldProducts
      : null;
  const sellThroughRate =
    stats.numberOfProducts > 0
      ? (stats.numberOfSoldProducts / stats.numberOfProducts) * 100
      : null;
  const averageDaysFromPurchaseToSaleRaw = stats.averageDaysFromPurchaseToSale;
  const averageDaysFromPurchaseToSale = toFiniteNumberOrNull(
    averageDaysFromPurchaseToSaleRaw,
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <PageHeader
        title={t("pages.dashboard.title")}
        description={t("pages.dashboard.description")}
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, minmax(0, 1fr))",
          },
        }}
      >
        <KpiCard
          size="large"
          label={t("pages.dashboard.kpi.realizedMargin")}
          value={formatPercentage(stats.soldProductsProfitPercentage, i18n.language)}
          accentColor={realizedMarginColor}
          icon={
            <PercentOutlinedIcon
              fontSize="small"
              sx={{ color: alpha(realizedMarginColor, 0.9) }}
            />
          }
        />

        <KpiCard
          size="large"
          label={t("pages.dashboard.kpi.averageProfitPerSoldProduct")}
          value={
            averageProfitPerSoldProduct === null
              ? "-"
              : formatPrice(averageProfitPerSoldProduct, i18n.language)
          }
          icon={<PaidOutlinedIcon fontSize="small" color="action" />}
        />

        <KpiCard
          size="large"
          label={t("pages.dashboard.kpi.frozenCapital")}
          value={formatPrice(frozenCapital, i18n.language)}
          accentColor={PRODUCT_STATUS_COLORS.unsold}
          icon={
            <AcUnitOutlinedIcon
              fontSize="small"
              sx={{ color: alpha(PRODUCT_STATUS_COLORS.unsold, 0.9) }}
            />
          }
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(5, minmax(0, 1fr))",
          },
        }}
      >
        <KpiCard
          label={t("pages.dashboard.kpi.totalProducts")}
          value={stats.numberOfProducts}
          icon={<Inventory2OutlinedIcon fontSize="small" color="action" />}
        />

        <KpiCard
          label={t("pages.dashboard.kpi.soldProducts")}
          value={stats.numberOfSoldProducts}
          icon={<ShoppingCartCheckoutOutlinedIcon fontSize="small" color="action" />}
        />

        <KpiCard
          label={t("pages.dashboard.kpi.sellThroughRate")}
          value={formatPercentage(sellThroughRate, i18n.language)}
          icon={<TrendingUpOutlinedIcon fontSize="small" color="action" />}
        />

        <KpiCard
          label={t("pages.dashboard.kpi.averageDaysFromPurchaseToSale")}
          value={
            averageDaysFromPurchaseToSale !== null
              ? `${new Intl.NumberFormat(i18n.language, {
                  maximumFractionDigits: 0,
                }).format(Math.round(averageDaysFromPurchaseToSale))} ${t(
                  "pages.dashboard.kpi.daysUnit",
                )}`
              : "-"
          }
          icon={<ScheduleOutlinedIcon fontSize="small" color="action" />}
        />

        <KpiCard
          label={t("pages.dashboard.kpi.totalProfit")}
          accentColor={profitColor}
          icon={
            <ShowChartOutlinedIcon
              fontSize="small"
              sx={{ color: alpha(profitColor, 0.9) }}
            />
          }
          value={
            <Box display="flex" alignItems="baseline" gap={1.5}>
              <Typography variant="h6" fontWeight={700} sx={{ color: profitColor }}>
                {formatPrice(stats.totalProfit, i18n.language)}
              </Typography>
              {stats.totalProfitPercentage !== null ? (
                <Typography variant="body2" sx={{ color: profitColor, fontWeight: 600 }}>
                  {t("pages.productDetails.finances.roi", {
                    value: formatPercentage(
                      stats.totalProfitPercentage,
                      i18n.language,
                      false,
                    ),
                  })}
                </Typography>
              ) : null}
            </Box>
          }
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="h6">{t("pages.dashboard.latestProducts")}</Typography>
          <Button variant="outlined" onClick={() => navigate("/products")}>
            {t("pages.dashboard.actions.showMore")}
          </Button>
        </Box>

        <ProductTable
          products={latestProducts}
          locale={i18n.language}
          onRowClick={(id) => navigate(`/products/${id}`)}
        />
      </Paper>
    </Box>
  );
}
