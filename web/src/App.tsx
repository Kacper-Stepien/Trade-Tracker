import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Button from "@mui/material/Button";
import LoginPage from "./pages/LoginPage";
import "./utils/i18n/index.ts";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Button variant="contained">Hello world</Button>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
