import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useProductByIdQuery } from "../../hooks/products";
import { useProductCostsQuery } from "../../hooks/product_costs";
import { PageLoader } from "../../components/PageLoader/PageLoader";
import { ProductAttribute, ProductCost } from "../../types/Product";
import { CreateProductCostModal } from "./CreateProductCostModal";
import { EditProductCostModal } from "./EditProductCostModal";
import { DeleteProductCostModal } from "./DeleteProductCostModal";
import { CreateProductAttributeModal } from "./CreateProductAttributeModal";
import { EditProductAttributeModal } from "./EditProductAttributeModal";
import { DeleteProductAttributeModal } from "./DeleteProductAttributeModal";
import { EditProductFocusField, EditProductModal } from "./EditProductModal";
import {
  MarkProductAsSoldFocusField,
  MarkProductAsSoldModal,
} from "./MarkProductAsSoldModal";
import { MarkProductAsUnsoldModal } from "./MarkProductAsUnsoldModal";
import { ProductFinancesSection } from "./ProductFinancesSection";
import { ProductSummarySection } from "./ProductSummarySection";
import { ProductAttributesSection } from "./ProductAttributesSection";
import { ProductCostsSection } from "./ProductCostsSection";
import { PRODUCT_STATUS_COLORS } from "../../utils/themes/themes";

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
  const [editingAttribute, setEditingAttribute] =
    useState<ProductAttribute | null>(null);
  const [deletingAttribute, setDeletingAttribute] =
    useState<ProductAttribute | null>(null);

  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editProductFocusField, setEditProductFocusField] =
    useState<EditProductFocusField | null>(null);

  const [isMarkAsSoldModalOpen, setIsMarkAsSoldModalOpen] = useState(false);
  const [markAsSoldFocusField, setMarkAsSoldFocusField] =
    useState<MarkProductAsSoldFocusField | null>(null);
  const [isMarkAsUnsoldModalOpen, setIsMarkAsUnsoldModalOpen] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useProductByIdQuery(productId, isValidProductId);
  const {
    data: costs,
    isLoading: isCostsLoading,
    isError: isCostsError,
  } = useProductCostsQuery(productId, isValidProductId);

  if (!isValidProductId) {
    return (
      <Alert severity="error">{t("pages.productDetails.invalidId")}</Alert>
    );
  }

  if (isLoading || isCostsLoading) {
    return <PageLoader />;
  }

  if (isError || isCostsError || !product) {
    return <Alert severity="error">{t("common.errors.fetchFailed")}</Alert>;
  }

  const statusColor = product.sold
    ? PRODUCT_STATUS_COLORS.sold
    : PRODUCT_STATUS_COLORS.unsold;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <IconButton
          onClick={() => navigate("/products")}
          size="small"
          sx={{ bgcolor: "action.hover", borderRadius: 1.5 }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
        </IconButton>
        <Breadcrumbs sx={{ fontSize: "0.875rem" }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate("/products")}
            sx={{ cursor: "pointer" }}
          >
            {t("pages.products.title")}
          </Link>
          <Typography color="text.primary" fontWeight={500}>
            {product.name}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
        mb={4}
      >
        <Stack spacing={0.5}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ letterSpacing: "-0.02em" }}
            >
              {product.name}
            </Typography>
            <Chip
              icon={
                product.sold ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />
              }
              label={
                product.sold
                  ? t("pages.productDetails.finances.sold")
                  : t("pages.productDetails.finances.unsold")
              }
              sx={{
                bgcolor: `${statusColor}20`,
                color: statusColor,
                borderColor: `${statusColor}40`,
                fontWeight: 700,
                px: 1,
                "& .MuiChip-icon": { color: "inherit" },
              }}
              variant="outlined"
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            {t("pages.productDetails.description")}
          </Typography>
        </Stack>
      </Box>

      <Divider sx={{ mb: 4, opacity: 0.6 }} />

      <Stack spacing={4}>
        <ProductFinancesSection
          product={product}
          costs={costs ?? []}
          locale={i18n.language}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 3,
          }}
        >
          <ProductSummarySection
            product={product}
            costs={costs ?? []}
            locale={i18n.language}
            onEditProduct={(field) => {
              setEditProductFocusField(field);
              setIsEditProductModalOpen(true);
            }}
            onMarkAsSold={(field) => {
              setMarkAsSoldFocusField(field);
              setIsMarkAsSoldModalOpen(true);
            }}
            onMarkAsUnsold={() => setIsMarkAsUnsoldModalOpen(true)}
          />

          <ProductAttributesSection
            attributes={product.attributes}
            onCreate={() => setIsCreateAttributeModalOpen(true)}
            onEdit={setEditingAttribute}
            onDelete={setDeletingAttribute}
          />
        </Box>

        <ProductCostsSection
          costs={costs ?? []}
          locale={i18n.language}
          onCreate={() => setIsCreateCostModalOpen(true)}
          onEdit={setEditingCost}
          onDelete={setDeletingCost}
        />
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
