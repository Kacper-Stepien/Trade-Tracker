import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

type KpiCardSize = "small" | "large";

type KpiCardProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  subtitle?: ReactNode;
  size?: KpiCardSize;
  accentColor?: string;
  valueColor?: string;
};

const DEFAULT_VALUE_VARIANT: Record<KpiCardSize, "h5" | "h6"> = {
  large: "h5",
  small: "h6",
};

const DEFAULT_PADDING: Record<KpiCardSize, number> = {
  large: 2.5,
  small: 2,
};

const isPrimitive = (value: ReactNode) =>
  typeof value === "string" || typeof value === "number";

export const KpiCard = ({
  label,
  value,
  icon,
  subtitle,
  size = "small",
  accentColor,
  valueColor,
}: KpiCardProps) => {
  const resolvedValueColor =
    valueColor ?? (accentColor ? accentColor : undefined);

  return (
    <Box
      sx={{
        p: DEFAULT_PADDING[size],
        borderRadius: size === "large" ? 1.5 : 2,
        transition: "filter 0.18s ease, transform 0.18s ease",
        "&:hover": {
          filter: "brightness(1.10)",
        },
        ...(accentColor
          ? {
              bgcolor: alpha(accentColor, 0.14),
              border: `1px solid ${alpha(accentColor, 0.35)}`,
              borderBottom: `3px solid ${accentColor}`,
            }
          : {
              bgcolor: "action.hover",
            }),
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent={icon ? "space-between" : "flex-start"}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
          textTransform="uppercase"
        >
          {label}
        </Typography>
        {icon}
      </Box>

      {isPrimitive(value) ? (
        <Typography
          variant={DEFAULT_VALUE_VARIANT[size]}
          fontWeight={700}
          mt={1}
          sx={resolvedValueColor ? { color: resolvedValueColor } : undefined}
        >
          {value}
        </Typography>
      ) : (
        <Box mt={1}>{value}</Box>
      )}

      {subtitle ? (
        isPrimitive(subtitle) ? (
          <Typography
            variant="body2"
            sx={{
              color: resolvedValueColor ?? "text.secondary",
              mt: 1,
              fontWeight: resolvedValueColor ? 600 : 400,
            }}
          >
            {subtitle}
          </Typography>
        ) : (
          <Box mt={1}>{subtitle}</Box>
        )
      ) : null}
    </Box>
  );
};
