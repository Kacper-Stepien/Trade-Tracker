import { RouterProvider } from "react-router-dom";
import "./utils/i18n/index.ts";
import { router } from "./utils/router/router.tsx";

import "./App.css";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
