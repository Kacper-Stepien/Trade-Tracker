import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import Button from "@mui/material/Button";
import AppLayout from "../../layouts/AppLayout";
import RegisterPage from "../../pages/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Button variant="contained">Hello world</Button>,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
]);
