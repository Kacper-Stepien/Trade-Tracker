import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import PublicLayout from "../../layouts/PublicLayout";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import DashboardPage from "../../pages/DashboardPage";
import { CategoriesPage } from "../../pages/Categories/CategoriesPage";
import CostTypesPage from "../../pages/CostTypes/CostTypesPage";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          {
            path: "/products",
            element: <div>Products Page - Coming Soon</div>,
          },
          { path: "/categories", element: <CategoriesPage /> },
          {
            path: "/cost-types",
            element: <CostTypesPage />,
          },
          {
            path: "/statistics",
            element: <div>Statistics Page - Coming Soon</div>,
          },
        ],
      },
    ],
  },
]);
