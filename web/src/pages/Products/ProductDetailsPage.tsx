import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
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
import {
  EditProductFocusField,
  EditProductModal,
} from "./EditProductModal";
import {
  MarkProductAsSoldFocusField,
  MarkProductAsSoldModal,
} from "./MarkProductAsSoldModal";
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
  const [editProductFocusField, setEditProductFocusField] =
    useState<EditProductFocusField | null>(null);

  const [isMarkAsSoldModalOpen, setIsMarkAsSoldModalOpen] = useState(false);
  const [markAsSoldFocusField, setMarkAsSoldFocusField] =
    useState<MarkProductAsSoldFocusField | null>(null);
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

  const openEditProductModal = (field: EditProductFocusField) => {
    setEditProductFocusField(field);
    setIsEditProductModalOpen(true);
  };

  const openMarkAsSoldModal = (field: MarkProductAsSoldFocusField) => {
    setMarkAsSoldFocusField(field);
    setIsMarkAsSoldModalOpen(true);
  };

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
          <Typography variant="h6" mb={2}>
            {t("pages.productDetails.sections.summary")}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            }}
          >
            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "action.hover" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {t("pages.addProduct.fields.name")}
                </Typography>
                <IconButton size="small" onClick={() => openEditProductModal("name")}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h6">{product.name}</Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "action.hover" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {t("pages.productDetails.fields.category")}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => openEditProductModal("categoryId")}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h6">{product.category?.name ?? "-"}</Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "action.hover" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {t("pages.productDetails.fields.purchasePrice")}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => openEditProductModal("purchasePrice")}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h6">
                {formatPrice(product.purchasePrice, i18n.language)}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "action.hover" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {t("pages.productDetails.fields.purchaseDate")}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => openEditProductModal("purchaseDate")}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h6">
                {formatDate(product.purchaseDate, i18n.language)}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "action.hover" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {t("pages.productDetails.fields.salePrice")}
                </Typography>
                <IconButton size="small" onClick={() => openMarkAsSoldModal("salePrice")}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h6">
                {formatPrice(product.salePrice, i18n.language)}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "action.hover" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {t("pages.productDetails.fields.saleDate")}
                </Typography>
                <IconButton size="small" onClick={() => openMarkAsSoldModal("saleDate")}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="h6">
                {formatDate(product.saleDate, i18n.language)}
              </Typography>
            </Box>

            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: "action.hover" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  {t("pages.productDetails.fields.status")}
                </Typography>
              </Box>
              <Box
                mt={0.5}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color={product.sold ? "success.main" : "error.main"}
                >
                  {product.sold
                    ? t("pages.products.status.sold")
                    : t("pages.products.status.unsold")}
                </Typography>
                {product.sold ? (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => setIsMarkAsUnsoldModalOpen(true)}
                  >
                    {t("pages.productDetails.actions.markAsUnsold")}
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => openMarkAsSoldModal("salePrice")}
                  >
                    {t("pages.productDetails.actions.markAsSold")}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
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
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
              }}
            >
              {product.attributes.map((attribute) => (
                <Box
                  key={attribute.id}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    bgcolor: "action.hover",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={1}
                  >
                    <Box>
                      <Typography variant="caption" color="primary.main">
                        {attribute.name}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => setEditingAttribute(attribute)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeletingAttribute(attribute)}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box mt={1.5}>
                    <Typography variant="h6">{attribute.value}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
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
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
              }}
            >
              {costs.map((cost) => (
                <Box
                  key={cost.id}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    bgcolor: "action.hover",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={1}
                  >
                    <Box>
                      <Typography variant="caption" color="primary.main">
                        {cost.name}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => setEditingCost(cost)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeletingCost(cost)}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="h6" mt={1.5}>
                    {formatPrice(cost.price, i18n.language)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {formatDate(cost.date, i18n.language)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cost.costType?.name ?? "-"}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {cost.description ?? "-"}
                  </Typography>
                </Box>
              ))}
            </Box>
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
        initialFocusField={editProductFocusField}
        onClose={() => {
          setIsEditProductModalOpen(false);
          setEditProductFocusField(null);
        }}
      />
      <MarkProductAsSoldModal
        open={isMarkAsSoldModalOpen}
        productId={productId}
        initialFocusField={markAsSoldFocusField}
        onClose={() => {
          setIsMarkAsSoldModalOpen(false);
          setMarkAsSoldFocusField(null);
        }}
      />
      <MarkProductAsUnsoldModal
        open={isMarkAsUnsoldModalOpen}
        productId={productId}
        onClose={() => setIsMarkAsUnsoldModalOpen(false)}
      />
    </Box>
  );
};
