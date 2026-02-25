import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  marginBottom?: number;
};

export const PageHeader = ({
  title,
  description,
  action,
  marginBottom = 4,
}: PageHeaderProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      gap={2}
      mb={marginBottom}
      flexShrink={0}
      flexWrap="wrap"
    >
      <Box>
        <Typography variant="h4" fontWeight={600}>
          {title}
        </Typography>
        {description ? <Typography variant="body2">{description}</Typography> : null}
      </Box>
      {action}
    </Box>
  );
};

