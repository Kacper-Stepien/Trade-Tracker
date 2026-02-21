import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useProductByIdQuery } from "../../hooks/products";
import { useProductCostsQuery } from "../../hooks/product_costs";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { formatDate, formatPrice } from "../../utils/formatters";
import { ProductAttribute, ProductCost } from "../../types/Product";
import { CreateProductCostModal } from "./CreateProductCostModal";
import { EditProductCostModal } from "./EditProductCostModal";
import { DeleteProductCostModal } from "./DeleteProductCostModal";
import { CreateProductAttributeModal } from "./CreateProductAttributeModal";
import { EditProductAttributeModal } from "./EditProductAttributeModal";
import { DeleteProductAttributeModal } from "./DeleteProductAttributeModal";
import { EditProductModal } from "./EditProductModal";
import { MarkProductAsSoldModal } from "./MarkProductAsSoldModal";
import { MarkProductAsUnsoldModal } from "./MarkProductAsUnsoldModal";

export const ProductDetailsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const productId = Number(id);
  const isValidProductId = Number.isInteger(productId) && productId > 0;
  const [isCreateCostModalOpen, setIsCreateCostModalOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<ProductCost | null>(null);
  const [deletingCost, setDeletingCost] = useState<ProductCost | null>(null);
  const [isCreateAttributeModalOpen, setIsCreateAttributeModalOpen] =
    useState(false);
  const [editingAttribute, setEditingAttribute] = useState<ProductAttribute | null>(
    null,
  );
  const [deletingAttribute, setDeletingAttribute] =
    useState<ProductAttribute | null>(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isMarkAsSoldModalOpen, setIsMarkAsSoldModalOpen] = useState(false);
  const [isMarkAsUnsoldModalOpen, setIsMarkAsUnsoldModalOpen] =
    useState(false);

  const { data: product, isLoading, isError } = useProductByIdQuery(
    productId,
    isValidProductId,
  );
  const {
    data: costs,
    isLoading: isCostsLoading,
    isError: isCostsError,
  } = useProductCostsQuery(productId, isValidProductId);

  if (!isValidProductId) {
    return <Alert severity="error">{t("pages.productDetails.invalidId")}</Alert>;
  }

  if (isLoading || isCostsLoading) {
    return <PageLoader />;
  }

  if (isError || isCostsError || !product) {
    return <Alert severity="error">{t("common.errors.fetchFailed")}</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {product.name}
          </Typography>
          <Typography variant="body2">
            {t("pages.productDetails.description")}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
        >
          {t("pages.productDetails.backToList")}
        </Button>
      </Box>

      <Stack spacing={3}>
        <Paper elevation={0} sx={{ borderRadius: 2, p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              {t("pages.productDetails.sections.summary")}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                variant="outlined"
                onClick={() => setIsEditProductModalOpen(true)}
              >
                {t("pages.productDetails.actions.editProduct")}
              </Button>
              {product.sold ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsMarkAsUnsoldModalOpen(true)}
                >
                  {t("pages.productDetails.actions.markAsUnsold")}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsMarkAsSoldModalOpen(true)}
                >
                  {t("pages.productDetails.actions.markAsSold")}
                </Button>
              )}
            </Stack>
          </Box>
          <Stack spacing={1}>
            <Typography>
              {t("pages.productDetails.fields.category")}:{" "}
              {product.category?.name ?? "-"}
            </Typography>
            <Typography>
              {t("pages.productDetails.fields.purchasePrice")}:{" "}
              {formatPrice(product.purchasePrice, i18n.language)}
            </Typography>
            <Typography>
              {t("pages.productDetails.fields.purchaseDate")}:{" "}
              {formatDate(product.purchaseDate, i18n.language)}
            </Typography>
            <Typography>
              {t("pages.productDetails.fields.status")}:{" "}
              {product.sold
                ? t("pages.products.status.sold")
                : t("pages.products.status.unsold")}
            </Typography>
            <Typography>
              {t("pages.productDetails.fields.salePrice")}:{" "}
              {formatPrice(product.salePrice, i18n.language)}
            </Typography>
            <Typography>
              {t("pages.productDetails.fields.saleDate")}:{" "}
              {formatDate(product.saleDate, i18n.language)}
            </Typography>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 2, p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              {t("pages.productDetails.sections.attributes")}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateAttributeModalOpen(true)}
            >
              {t("pages.productDetails.attributes.actions.add")}
            </Button>
          </Box>
          {!product.attributes.length ? (
            <Typography color="text.secondary">
              {t("pages.productDetails.empty.attributes")}
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("pages.productDetails.tables.name")}</TableCell>
                    <TableCell>{t("pages.productDetails.tables.value")}</TableCell>
                    <TableCell align="right">
                      {t("pages.productDetails.tables.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {product.attributes.map((attribute) => (
                    <TableRow key={attribute.id}>
                      <TableCell>{attribute.name}</TableCell>
                      <TableCell>{attribute.value}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => setEditingAttribute(attribute)}>
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => setDeletingAttribute(attribute)}
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 2, p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">
              {t("pages.productDetails.sections.costs")}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setIsCreateCostModalOpen(true)}
            >
              {t("pages.productDetails.costs.actions.add")}
            </Button>
          </Box>
          {!costs?.length ? (
            <Typography color="text.secondary">
              {t("pages.productDetails.empty.costs")}
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("pages.productDetails.tables.name")}</TableCell>
                    <TableCell>{t("pages.productDetails.tables.price")}</TableCell>
                    <TableCell>{t("pages.productDetails.tables.date")}</TableCell>
                    <TableCell>
                      {t("pages.productDetails.tables.description")}
                    </TableCell>
                    <TableCell>
                      {t("pages.productDetails.tables.costType")}
                    </TableCell>
                    <TableCell align="right">
                      {t("pages.productDetails.tables.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {costs.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell>{cost.name}</TableCell>
                      <TableCell>{formatPrice(cost.price, i18n.language)}</TableCell>
                      <TableCell>{formatDate(cost.date, i18n.language)}</TableCell>
                      <TableCell>{cost.description ?? "-"}</TableCell>
                      <TableCell>{cost.costType?.name ?? "-"}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => setEditingCost(cost)}>
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => setDeletingCost(cost)}>
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Stack>

      <CreateProductCostModal
        open={isCreateCostModalOpen}
        productId={productId}
        onClose={() => setIsCreateCostModalOpen(false)}
      />
      <EditProductCostModal
        productId={productId}
        cost={editingCost}
        onClose={() => setEditingCost(null)}
      />
      <DeleteProductCostModal
        productId={productId}
        cost={deletingCost}
        onClose={() => setDeletingCost(null)}
      />

      <CreateProductAttributeModal
        open={isCreateAttributeModalOpen}
        productId={productId}
        onClose={() => setIsCreateAttributeModalOpen(false)}
      />
      <EditProductAttributeModal
        productId={productId}
        attribute={editingAttribute}
        onClose={() => setEditingAttribute(null)}
      />
      <DeleteProductAttributeModal
        productId={productId}
        attribute={deletingAttribute}
        onClose={() => setDeletingAttribute(null)}
      />

      <EditProductModal
        product={isEditProductModalOpen ? product : null}
        onClose={() => setIsEditProductModalOpen(false)}
      />
      <MarkProductAsSoldModal
        open={isMarkAsSoldModalOpen}
        productId={productId}
        onClose={() => setIsMarkAsSoldModalOpen(false)}
      />
      <MarkProductAsUnsoldModal
        open={isMarkAsUnsoldModalOpen}
        productId={productId}
        onClose={() => setIsMarkAsUnsoldModalOpen(false)}
      />
    </Box>
  );
};
