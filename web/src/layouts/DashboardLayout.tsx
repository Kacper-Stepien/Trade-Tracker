import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import { useTheme } from "../hooks/useTheme";

export default function DashboardLayout() {
  const { theme } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.default,
          overflowX: "hidden",
        }}
        color="text.primary"
      >
        <DashboardHeader />

        <Box></Box>
        <Box
          sx={{
            flexGrow: 1,
            p: 4,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
