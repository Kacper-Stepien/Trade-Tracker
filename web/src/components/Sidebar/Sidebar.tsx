import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CollectionsBookmark from "@mui/icons-material/CollectionsBookmark";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Logo from "../ui/Logo/Logo";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "react-i18next";

const DRAWER_WIDTH = 240;
const DRAWER_COLLAPSED_WIDTH = 72;

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const inactiveColor = theme.palette.mode === "dark" ? "#6b7280" : "#9ca3af";

  const menuItems: MenuItem[] = [
    { label: t("sidebar.dashboard"), path: "/", icon: <DashboardIcon /> },
    {
      label: t("sidebar.products"),
      path: "/products",
      icon: <InventoryIcon />,
    },
    {
      label: t("sidebar.categories"),
      path: "/categories",
      icon: <CollectionsBookmark />,
    },
    {
      label: t("sidebar.costTypes"),
      path: "/cost-types",
      icon: <ReceiptIcon />,
    },
    {
      label: t("sidebar.statistics"),
      path: "/statistics",
      icon: <BarChartIcon />,
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 2,
          py: 1.5,
          minHeight: 56,
        }}
      >
        {!collapsed && <Logo size="small" />}
        <IconButton
          onClick={toggleCollapse}
          size="small"
          sx={{
            color: inactiveColor,
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <List sx={{ px: 1, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 1.5,
                  minHeight: 44,
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: 2,
                  backgroundColor: isActive
                    ? theme.palette.primary.main + "20"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isActive
                      ? theme.palette.primary.main + "30"
                      : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 1.5,
                    justifyContent: "center",
                    color: isActive
                      ? theme.palette.primary.main
                      : inactiveColor,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: "0.9rem",
                        fontWeight: isActive ? 500 : 400,
                        color: isActive
                          ? theme.palette.text.primary
                          : inactiveColor,
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
