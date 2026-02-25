import { Chip, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { SxProps, Theme } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Product } from "../../types/Product";
import { formatDate, formatPrice } from "../../utils/formatters";
import { toSafeNumber } from "../../utils/number";
import { PRODUCT_STATUS_COLORS } from "../../utils/themes/themes";
import { DataTableLayout } from "../DataTable/DataTableLayout";

type ProductTableProps = {
  products: Product[];
  locale: string;
  onRowClick?: (id: number) => void;
  tableContainerSx?: SxProps<Theme>;
  emptyMessage?: string;
};

export const ProductTable = ({
  products,
  locale,
  onRowClick,
  tableContainerSx,
  emptyMessage,
}: ProductTableProps) => {
  const { t } = useTranslation();

  return (
    <DataTableLayout tableContainerSx={tableContainerSx}>
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
          {products.length ? (
            products.map((product) => {
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
                  onClick={onRowClick ? () => onRowClick(product.id) : undefined}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    "&:hover": {
                      backgroundColor: onRowClick ? "action.hover" : "inherit",
                    },
                  }}
                >
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name ?? "-"}</TableCell>
                  <TableCell>
                    {formatPrice(product.purchasePrice, locale)}
                  </TableCell>
                  <TableCell>{formatPrice(totalCosts, locale)}</TableCell>
                  <TableCell>{formatDate(product.purchaseDate, locale)}</TableCell>
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
                  <TableCell>{formatPrice(product.salePrice, locale)}</TableCell>
                  <TableCell>{formatDate(product.saleDate, locale)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        product.sold
                          ? formatPrice(profit, locale)
                          : t("pages.products.table.pendingSale")
                      }
                      sx={{
                        bgcolor: alpha(
                          product.sold ? profitColor : PRODUCT_STATUS_COLORS.unsold,
                          0.14,
                        ),
                        color: product.sold ? profitColor : PRODUCT_STATUS_COLORS.unsold,
                        borderColor: alpha(
                          product.sold ? profitColor : PRODUCT_STATUS_COLORS.unsold,
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
                {emptyMessage ?? t("pages.products.table.empty")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
    </DataTableLayout>
  );
};
