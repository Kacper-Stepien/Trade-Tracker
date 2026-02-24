import { Box, Paper, Stack, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTranslation } from "react-i18next";
import { Product, ProductCost } from "../../types/Product";
import { formatPrice } from "../../utils/formatters";
import { PRODUCT_STATUS_COLORS } from "../../utils/themes/themes";
import { KpiCard } from "../../components/KpiCard/KpiCard";

type ProductFinancesSectionProps = {
  product: Product;
  costs: ProductCost[];
  locale: string;
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

const getDaysBetweenDates = (from: string, to: string) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    return null;
  }

  const fromUtc = Date.UTC(
    fromDate.getUTCFullYear(),
    fromDate.getUTCMonth(),
    fromDate.getUTCDate(),
  );
  const toUtc = Date.UTC(
    toDate.getUTCFullYear(),
    toDate.getUTCMonth(),
    toDate.getUTCDate(),
  );

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.round((toUtc - fromUtc) / millisecondsPerDay));
};

export const ProductFinancesSection = ({
  product,
  costs,
  locale,
}: ProductFinancesSectionProps) => {
  const { t } = useTranslation();

  const purchasePrice = toSafeNumber(product.purchasePrice);
  const salePrice = toSafeNumber(product.salePrice);
  const totalCosts = costs.reduce(
    (sum, cost) => sum + toSafeNumber(cost.price),
    0,
  );

  const totalInvestment = purchasePrice + totalCosts;
  const profit =
    product.sold && product.salePrice !== null
      ? salePrice - purchasePrice - totalCosts
      : null;

  const resultValue = toSafeNumber(profit);
  const isProfit = product.sold && resultValue >= 0;
  const isLoss = product.sold && resultValue < 0;
  const roi =
    isProfit && totalInvestment > 0
      ? ((resultValue / totalInvestment) * 100).toFixed(1)
      : null;
  const daysToSale =
    product.sold && product.saleDate
      ? getDaysBetweenDates(product.purchaseDate, product.saleDate)
      : null;

  const resultLabel = isProfit
    ? t("pages.productDetails.finances.metrics.profit")
    : t("pages.productDetails.finances.metrics.loss");

  const paidColor = PRODUCT_STATUS_COLORS.unsold;
  const resultColor = !product.sold
    ? PRODUCT_STATUS_COLORS.unsold
    : isProfit
      ? PRODUCT_STATUS_COLORS.sold
      : PRODUCT_STATUS_COLORS.loss;
  const resultCardColor = !product.sold
    ? PRODUCT_STATUS_COLORS.unsold
    : isProfit
      ? PRODUCT_STATUS_COLORS.sold
      : PRODUCT_STATUS_COLORS.loss;

  const resultAbsolute = Math.abs(resultValue);
  const totalComparedValue =
    totalInvestment + (product.sold ? resultAbsolute : 0);
  const paidShare = totalComparedValue
    ? Math.round((totalInvestment / totalComparedValue) * 100)
    : 0;
  const resultShare = totalComparedValue ? 100 - paidShare : 0;

  const pieData = [
    {
      id: 0,
      value: totalInvestment,
      label: t("pages.productDetails.finances.metrics.totalInvestment"),
      color: paidColor,
      share: paidShare,
    },
    ...(product.sold
      ? [
          {
            id: 1,
            value: resultAbsolute,
            label: resultLabel,
            color: resultColor,
            share: resultShare,
          },
        ]
      : []),
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        p: { xs: 2, md: 3 },
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1.5}
        mb={3}
      >
        <Typography variant="h5" fontWeight={700}>
          {t("pages.productDetails.sections.finances")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <KpiCard
          size="large"
          label={t("pages.productDetails.finances.metrics.totalInvestment")}
          value={formatPrice(totalInvestment, locale)}
          subtitle={t("pages.productDetails.finances.totalInvestmentFormula", {
            purchase: formatPrice(purchasePrice, locale),
            costs: formatPrice(totalCosts, locale),
          })}
        />

        <KpiCard
          size="large"
          label={t("pages.productDetails.finances.metrics.salePrice")}
          value={formatPrice(product.sold ? salePrice : null, locale)}
        />

        <KpiCard
          size="large"
          label={t("pages.productDetails.finances.metrics.daysToSale")}
          value={
            daysToSale !== null
              ? t("pages.productDetails.finances.daysToSaleValue", {
                  value: daysToSale,
                })
              : t("pages.productDetails.finances.pendingResult")
          }
        />

        <KpiCard
          size="large"
          label={t("pages.productDetails.finances.metrics.result")}
          accentColor={resultCardColor}
          value={
            <Box display="flex" alignItems="baseline" gap={1.5}>
              <Typography variant="h5" fontWeight={700} sx={{ color: resultColor }}>
                {product.sold
                  ? formatPrice(profit, locale)
                  : t("pages.productDetails.finances.pendingResult")}
              </Typography>
              {roi ? (
                <Typography variant="body2" sx={{ color: resultColor, fontWeight: 600 }}>
                  {t("pages.productDetails.finances.roi", { value: roi })}
                </Typography>
              ) : null}
            </Box>
          }
          subtitle={
            isLoss ? (
              <Typography variant="body2">
                {t("pages.productDetails.finances.lossHint")}
              </Typography>
            ) : null
          }
        />
      </Box>

      <Box
        mt={3}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 2,
          bgcolor: "action.hover",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 6,
            alignItems: "center",
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "300px" }, height: 240 }}>
            <PieChart
              series={[
                {
                  data: pieData,
                  innerRadius: 75,
                  outerRadius: 110,
                  paddingAngle: 3,
                  cornerRadius: 4,
                  valueFormatter: (value) => formatPrice(value.value, locale),
                },
              ]}
              margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
              sx={{ "& .MuiChartsLegend-root": { display: "none" } }}
            />
          </Box>

          <Stack
            spacing={2.5}
            sx={{ flex: 1, width: "100%", justifyContent: "center" }}
          >
            {pieData.map((item) => (
              <Box
                key={String(item.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: item.color,
                    }}
                  />
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color="text.primary"
                  >
                    {item.label}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h6" fontWeight={700}>
                    {formatPrice(item.value, locale)}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    {t("pages.productDetails.finances.partOfTotal", {
                      value: item.share,
                    })}
                  </Typography>
                </Box>
              </Box>
            ))}

            {!product.sold ? (
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
                textAlign="center"
              >
                {t("pages.productDetails.finances.noResultYet")}
              </Typography>
            ) : null}
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};
