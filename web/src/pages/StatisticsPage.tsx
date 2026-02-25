import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import {
  STATS_RANGE,
  StatsRange,
} from "../types/Stats";
import {
  useUserStatsByRangeQuery,
  useUserStatsChartsByRangeQuery,
} from "../hooks/stats";
import { formatPrice } from "../utils/formatters";
import { PRODUCT_STATUS_COLORS } from "../utils/themes/themes";
import { PageLoader } from "../components/PageLoader/PageLoader";
import { KpiCard } from "../components/KpiCard/KpiCard";
import { PageHeader } from "../components/PageHeader/PageHeader";
import { formatAxisNumber, formatPercentage } from "../utils/number";
import { formatRangePeriodLabel } from "../utils/date";

const getRangeMonthsCount = (range: StatsRange) => {
  switch (range) {
    case STATS_RANGE.LAST_3_MONTHS:
      return 3;
    case STATS_RANGE.LAST_6_MONTHS:
      return 6;
    case STATS_RANGE.LAST_12_MONTHS:
      return 12;
    default:
      return null;
  }
};

const PIE_WARM_COLORS = [
  "#E76F51",
  "#F4A261",
  "#E9C46A",
  "#D62828",
  "#FF7F51",
  "#B56576",
  "#CB997E",
  "#F28482",
];

export default function StatisticsPage() {
  const { t, i18n } = useTranslation();
  const [range, setRange] = useState<StatsRange>(STATS_RANGE.LAST_3_MONTHS);

  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useUserStatsByRangeQuery(range);
  const {
    data: charts,
    isLoading: isChartsLoading,
    isError: isChartsError,
  } = useUserStatsChartsByRangeQuery(range);

  const rangeOptions = [
    { value: STATS_RANGE.ALL, label: t("pages.statistics.filters.allTime") },
    {
      value: STATS_RANGE.LAST_3_MONTHS,
      label: t("pages.statistics.filters.last3Months"),
    },
    {
      value: STATS_RANGE.LAST_6_MONTHS,
      label: t("pages.statistics.filters.last6Months"),
    },
    {
      value: STATS_RANGE.LAST_12_MONTHS,
      label: t("pages.statistics.filters.last12Months"),
    },
  ];

  const chartPieData = useMemo(
    () =>
      (charts?.profitByCategory ?? []).map((item, index) => ({
        id: index,
        value: item.profit,
        label: item.category,
        color: PIE_WARM_COLORS[index % PIE_WARM_COLORS.length],
      })),
    [charts],
  );

  const normalizedTrend = useMemo(() => {
    const rawTrend = charts?.profitTrend ?? [];
    const monthsCount = getRangeMonthsCount(range);

    if (monthsCount === null) {
      return rawTrend;
    }

    const trendMap = new Map(rawTrend.map((item) => [item.period, item.profit]));
    const now = new Date();
    const currentUtcYear = now.getUTCFullYear();
    const currentUtcMonth = now.getUTCMonth();

    return Array.from({ length: monthsCount }, (_, index) => {
      const monthsBack = monthsCount - 1 - index;
      const date = new Date(
        Date.UTC(currentUtcYear, currentUtcMonth - monthsBack, 1),
      );
      const period = `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1,
      ).padStart(2, "0")}`;

      return {
        period,
        profit: trendMap.get(period) ?? 0,
      };
    });
  }, [charts, range]);

  const trendPeriods = useMemo(
    () =>
      normalizedTrend.map((item) =>
        formatRangePeriodLabel(item.period, i18n.language),
      ),
    [normalizedTrend, i18n.language],
  );

  const trendProfitValues = useMemo(
    () => normalizedTrend.map((item) => (item.profit > 0 ? item.profit : 0)),
    [normalizedTrend],
  );

  const trendLossValues = useMemo(
    () => normalizedTrend.map((item) => (item.profit < 0 ? Math.abs(item.profit) : 0)),
    [normalizedTrend],
  );

  if (isStatsLoading || isChartsLoading) {
    return <PageLoader />;
  }

  if (isStatsError || isChartsError || !stats || !charts) {
    return <Alert severity="error">{t("common.errors.fetchFailed")}</Alert>;
  }

  const totalProfitColor =
    stats.totalProfit >= 0 ? PRODUCT_STATUS_COLORS.sold : PRODUCT_STATUS_COLORS.loss;
  const averageProfitPerSoldProduct =
    stats.numberOfSoldProducts > 0
      ? stats.soldProductsProfit / stats.numberOfSoldProducts
      : null;
  const sellThroughRate =
    stats.numberOfProducts > 0
      ? (stats.numberOfSoldProducts / stats.numberOfProducts) * 100
      : null;
  const frozenCapital = stats.totalCosts - stats.soldProductsCosts;
  const avgDaysRounded =
    stats.averageDaysFromPurchaseToSale !== null
      ? Math.round(stats.averageDaysFromPurchaseToSale)
      : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <PageHeader
        title={t("pages.statistics.title")}
        description={t("pages.statistics.description")}
        action={
          <FormControl sx={{ minWidth: 220, alignSelf: "flex-end" }} size="small">
            <InputLabel id="statistics-range-label">
              {t("pages.statistics.filters.range")}
            </InputLabel>
            <Select
              labelId="statistics-range-label"
              value={range}
              label={t("pages.statistics.filters.range")}
              onChange={(event) => setRange(event.target.value as StatsRange)}
            >
              {rangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <KpiCard
          size="large"
          label={t("pages.statistics.kpi.totalRevenue")}
          value={formatPrice(stats.totalRevenue, i18n.language)}
        />
        <KpiCard
          size="large"
          label={t("pages.statistics.kpi.totalCosts")}
          value={formatPrice(stats.totalCosts, i18n.language)}
        />
        <KpiCard
          size="large"
          label={t("pages.statistics.kpi.netProfit")}
          value={formatPrice(stats.totalProfit, i18n.language)}
          accentColor={totalProfitColor}
          subtitle={formatPercentage(stats.totalProfitPercentage, i18n.language)}
        />
        <KpiCard
          size="large"
          label={t("pages.statistics.kpi.transactions")}
          value={stats.numberOfSoldProducts}
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
          label={t("pages.statistics.kpi.realizedMargin")}
          value={formatPercentage(stats.soldProductsProfitPercentage, i18n.language)}
        />
        <KpiCard
          label={t("pages.statistics.kpi.averageProfitPerSoldProduct")}
          value={
            averageProfitPerSoldProduct === null
              ? "-"
              : formatPrice(averageProfitPerSoldProduct, i18n.language)
          }
        />
        <KpiCard
          label={t("pages.statistics.kpi.sellThroughRate")}
          value={formatPercentage(sellThroughRate, i18n.language)}
        />
        <KpiCard
          label={t("pages.statistics.kpi.averageDaysFromPurchaseToSale")}
          value={
            avgDaysRounded === null
              ? "-"
              : `${avgDaysRounded} ${t("pages.statistics.kpi.daysUnit")}`
          }
        />
        <KpiCard
          label={t("pages.statistics.kpi.frozenCapital")}
          value={formatPrice(frozenCapital, i18n.language)}
          accentColor={PRODUCT_STATUS_COLORS.unsold}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{ p: 2.5, borderRadius: 2, border: 1, borderColor: "divider" }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            {t("pages.statistics.charts.profitTrend")}
          </Typography>
          {normalizedTrend.length ? (
            <BarChart
              height={320}
              xAxis={[{ scaleType: "band", data: trendPeriods }]}
              yAxis={[
                {
                  min: 0,
                  valueFormatter: (value) => formatAxisNumber(value, i18n.language),
                },
              ]}
              series={[
                {
                  data: trendProfitValues,
                  label: t("pages.statistics.charts.profit"),
                  color: PRODUCT_STATUS_COLORS.sold,
                  stack: "result",
                },
                {
                  data: trendLossValues,
                  label: t("pages.statistics.charts.loss"),
                  color: PRODUCT_STATUS_COLORS.loss,
                  stack: "result",
                },
              ]}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("pages.statistics.charts.noTrendData")}
            </Typography>
          )}
        </Paper>

        <Paper
          elevation={0}
          sx={{ p: 2.5, borderRadius: 2, border: 1, borderColor: "divider" }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            {t("pages.statistics.charts.profitByCategory")}
          </Typography>
          {chartPieData.length ? (
            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <PieChart
                height={280}
                series={[
                  {
                    data: chartPieData,
                    innerRadius: 65,
                    outerRadius: 105,
                    paddingAngle: 2,
                    cornerRadius: 4,
                    valueFormatter: (value) => formatPrice(value.value, i18n.language),
                  },
                ]}
                sx={{ "& .MuiChartsLegend-root": { display: "none" } }}
              />

              <Stack spacing={1.2} sx={{ width: "100%" }}>
                {charts.profitByCategory.map((item) => (
                  <Box
                    key={item.category}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1,
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.category}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {formatPrice(item.profit, i18n.language)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("pages.statistics.charts.noCategoryData")}
            </Typography>
          )}
        </Paper>
      </Box>

    </Box>
  );
}
