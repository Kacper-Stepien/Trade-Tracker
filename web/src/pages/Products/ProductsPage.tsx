import { useTranslation } from "react-i18next";
import {
  Alert,
  Box,
  Button,
  Paper,
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

export const ProductsPage = () => {
  const { t, i18n } = useTranslation();
  const { page, rowsPerPage, handlePageChange, handleRowsPerPageChange } =
    usePagination();

  const { data, isLoading, isError } = useProductsQuery({
    page: page + 1,
    limit: rowsPerPage,
  });

  const handleCreateProduct = () => {};

  if (isLoading) {
    return <PageLoader />;
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

      <TableContainer component={Paper} sx={{ borderRadius: 2 }} elevation={0}>
        <Box sx={{ px: 2, py: 6 }}>
          <Table>
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
                    <TableRow key={product.id}>
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
                        color={
                          product.sold ? "success.main" : "error.main"
                        }
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
        </Box>
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
      </TableContainer>
    </Box>
  );
};
