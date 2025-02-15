import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import Button from "@mui/material/Button";
import AppLayout from "../../layouts/AppLayout";
import RegisterPage from "../../pages/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Button variant="contained">Hello world</Button>,
          },
        ],
      },
    ],
  },
]);
