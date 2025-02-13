import { Box, Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../hooks/useTheme";

export default function AppLayout() {
  const { theme } = useTheme();

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
      minHeight="100vh"
    >
      <Navbar />
      <Box
        flex={1}
        bgcolor={theme.palette.background.default}
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <Outlet />
      </Box>
      <Footer />
    </Grid>
  );
}
