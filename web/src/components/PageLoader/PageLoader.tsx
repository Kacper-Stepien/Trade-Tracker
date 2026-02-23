import { Box, CircularProgress } from "@mui/material";

type PageLoaderProps = {
  minHeight?: string | number;
};

export const PageLoader = ({ minHeight = 200 }: PageLoaderProps) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={minHeight}
    >
      <CircularProgress />
    </Box>
  );
};
