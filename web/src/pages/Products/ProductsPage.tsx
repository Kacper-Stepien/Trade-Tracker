import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useProductsQuery } from "../../hooks/products";
import { usePagination } from "../../hooks/usePagination";
import { TABLE_ROWS_PER_PAGE_OPTIONS } from "../../constants/pagination";
import { formatDate, formatPrice } from "../../utils/formatters";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { useCategoriesQuery } from "../../hooks/categories";
import { useProductsFilters } from "../../hooks/products/useProductsFilters";
import {
  PRODUCT_CATEGORY_FILTER_ALL,
  PRODUCT_SOLD_FILTER,
} from "../../types/Product";
import { PRODUCT_STATUS_COLORS } from "../../utils/themes/themes";

export const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    page,
    rowsPerPage,
    setPage,
    handlePageChange,
    handleRowsPerPageChange,
  } = usePagination();
  const { data: categories } = useCategoriesQuery();
  const {
    soldFilter,
    categoryFilter,
    soldParam,
    categoryParam,
    handleSoldFilterChange,
    handleCategoryFilterChange,
  } = useProductsFilters(() => setPage(0));

  const { data, isLoading, isError } = useProductsQuery({
    page: page + 1,
    limit: rowsPerPage,
    sold: soldParam,
    category: categoryParam,
  });

  const handleCreateProduct = () => {
    navigate("/products/add");
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
            {t("pages.products.title")}
          </Typography>
          <Typography variant="body2">
            {t("pages.products.description")}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateProduct}
        >
          {t("pages.products.actions.addProduct")}
        </Button>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={3}
        flexShrink={0}
      >
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="products-status-filter-label">
            {t("pages.products.filters.status")}
          </InputLabel>
          <Select
            labelId="products-status-filter-label"
            label={t("pages.products.filters.status")}
            value={soldFilter}
            onChange={handleSoldFilterChange}
          >
            <MenuItem value={PRODUCT_SOLD_FILTER.ALL}>
              {t("pages.products.filters.options.allStatuses")}
            </MenuItem>
            <MenuItem value={PRODUCT_SOLD_FILTER.SOLD}>
              {t("pages.products.filters.options.sold")}
            </MenuItem>
            <MenuItem value={PRODUCT_SOLD_FILTER.UNSOLD}>
              {t("pages.products.filters.options.unsold")}
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel id="products-category-filter-label">
            {t("pages.products.filters.category")}
          </InputLabel>
          <Select
            labelId="products-category-filter-label"
            label={t("pages.products.filters.category")}
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
          >
            <MenuItem value={PRODUCT_CATEGORY_FILTER_ALL}>
              {t("pages.products.filters.options.allCategories")}
            </MenuItem>
            {categories?.map((category) => (
              <MenuItem key={category.id} value={String(category.id)}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

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
                  {t("pages.products.table.name")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.products.table.category")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.products.table.purchasePrice")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.products.table.costs")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.products.table.purchaseDate")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.products.table.sold")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.products.table.salePrice")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.products.table.saleDate")}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>
                  {t("pages.products.table.profitLoss")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.products.length ? (
                data.products.map((product) => {
                  const totalCosts = (product.costs ?? []).reduce(
                    (sum, cost) => sum + toSafeNumber(cost.price),
                    0,
                  );
                  const purchasePrice = toSafeNumber(product.purchasePrice);
                  const salePrice = toSafeNumber(product.salePrice);
                  const profit =
                    product.sold && product.salePrice !== null
                      ? salePrice - purchasePrice - totalCosts
                      : null;

                  const profitColor =
                    (profit ?? 0) >= 0
                      ? PRODUCT_STATUS_COLORS.sold
                      : PRODUCT_STATUS_COLORS.loss;
                  const statusColor = product.sold
                    ? profit !== null && profit < 0
                      ? PRODUCT_STATUS_COLORS.loss
                      : PRODUCT_STATUS_COLORS.sold
                    : PRODUCT_STATUS_COLORS.unsold;

                  return (
                    <TableRow
                      key={product.id}
                      hover
                      onClick={() => navigate(`/products/${product.id}`)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category?.name ?? "-"}</TableCell>
                      <TableCell>
                        {formatPrice(product.purchasePrice, i18n.language)}
                      </TableCell>
                      <TableCell>
                        {formatPrice(totalCosts, i18n.language)}
                      </TableCell>
                      <TableCell>
                        {formatDate(product.purchaseDate, i18n.language)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            product.sold
                              ? t("pages.products.status.sold")
                              : t("pages.products.status.unsold")
                          }
                          sx={{
                            bgcolor: alpha(statusColor, 0.14),
                            color: statusColor,
                            borderColor: alpha(statusColor, 0.35),
                            fontWeight: 700,
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {formatPrice(product.salePrice, i18n.language)}
                      </TableCell>
                      <TableCell>
                        {formatDate(product.saleDate, i18n.language)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            product.sold
                              ? formatPrice(profit, i18n.language)
                              : t("pages.products.table.pendingSale")
                          }
                          sx={{
                            bgcolor: alpha(
                              product.sold
                                ? profitColor
                                : PRODUCT_STATUS_COLORS.unsold,
                              0.14,
                            ),
                            color: product.sold
                              ? profitColor
                              : PRODUCT_STATUS_COLORS.unsold,
                            borderColor: alpha(
                              product.sold
                                ? profitColor
                                : PRODUCT_STATUS_COLORS.unsold,
                              0.35,
                            ),
                            fontWeight: 700,
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    {t("pages.products.table.empty")}
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
          labelRowsPerPage={t("pages.products.pagination.rowsPerPage")}
          labelDisplayedRows={({ from, to, count }) =>
            t("pages.products.pagination.displayedRows", {
              from,
              to,
              total: count === -1 ? `>${to}` : count,
            })
          }
        />
      </Paper>
    </Box>
  );
};
