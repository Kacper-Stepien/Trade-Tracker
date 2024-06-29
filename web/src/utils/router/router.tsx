import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import Button from "@mui/material/Button";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Button variant="contained">Hello world</Button>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
