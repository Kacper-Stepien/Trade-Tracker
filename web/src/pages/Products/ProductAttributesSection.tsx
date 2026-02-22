import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import { useTranslation } from "react-i18next";
import { ProductAttribute } from "../../types/Product";

type ProductAttributesSectionProps = {
  attributes: ProductAttribute[];
  onCreate: () => void;
  onEdit: (attribute: ProductAttribute) => void;
  onDelete: (attribute: ProductAttribute) => void;
};

export const ProductAttributesSection = ({
  attributes,
  onCreate,
  onEdit,
  onDelete,
}: ProductAttributesSectionProps) => {
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        p: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <LabelOutlinedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="h6" fontWeight={700}>
            {t("pages.productDetails.sections.attributes", "Parametry")}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onCreate}
          sx={{
            borderRadius: 1.5,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {t("pages.productDetails.attributes.actions.add", "Dodaj")}
        </Button>
      </Box>

      {!attributes.length ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography color="text.secondary">
            {t(
              "pages.productDetails.empty.attributes",
              "Brak zdefiniowanych parametrów",
            )}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {attributes.map((attribute) => (
            <Box
              key={attribute.id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                border: 1,
                borderColor: "divider",
                transition: "0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {attribute.name}
                </Typography>
                <Typography variant="h6" fontWeight={600} mt={0.5}>
                  {attribute.value}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  pt: 1,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  gap: 0.5,
                }}
              >
                <Tooltip title={t("common.actions.edit", "Edytuj")}>
                  <IconButton size="small" onClick={() => onEdit(attribute)}>
                    <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("common.actions.delete", "Usuń")}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(attribute)}
                    sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
                  >
                    <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};
