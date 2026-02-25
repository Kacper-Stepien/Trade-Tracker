import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TablePagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useProductsQuery } from "../../hooks/products";
import { usePagination } from "../../hooks/usePagination";
import { TABLE_ROWS_PER_PAGE_OPTIONS } from "../../constants/pagination";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { ProductTable } from "../../components/ProductTable/ProductTable";
import { DataTableContainer } from "../../components/DataTable/DataTableContainer";
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
      <PageHeader
        title={t("pages.products.title")}
        description={t("pages.products.description")}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateProduct}
            sx={{ alignSelf: "flex-end" }}
          >
            {t("pages.products.actions.addProduct")}
          </Button>
        }
      />

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

      <DataTableContainer
        pagination={
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
        }
      >
        <ProductTable
          products={data?.products ?? []}
          locale={i18n.language}
          onRowClick={(id) => navigate(`/products/${id}`)}
          tableContainerSx={{
            flex: 1,
            minHeight: 0,
            overflowY: "scroll",
          }}
        />
      </DataTableContainer>
    </Box>
  );
};
