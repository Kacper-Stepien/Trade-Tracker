import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
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
                <TableCell>{t("pages.products.table.name")}</TableCell>
                <TableCell>{t("pages.products.table.category")}</TableCell>
                <TableCell>{t("pages.products.table.purchasePrice")}</TableCell>
                <TableCell>{t("pages.products.table.purchaseDate")}</TableCell>
                <TableCell>{t("pages.products.table.sold")}</TableCell>
                <TableCell>{t("pages.products.table.salePrice")}</TableCell>
                <TableCell>{t("pages.products.table.saleDate")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.products.length ? (
                data.products.map((product) => (
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
                      {formatDate(product.purchaseDate, i18n.language)}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={product.sold ? "success.main" : "error.main"}
                      >
                        {product.sold
                          ? t("pages.products.status.sold")
                          : t("pages.products.status.unsold")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatPrice(product.salePrice, i18n.language)}
                    </TableCell>
                    <TableCell>
                      {formatDate(product.saleDate, i18n.language)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
