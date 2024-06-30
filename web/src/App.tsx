import { RouterProvider } from "react-router-dom";
import "./utils/i18n/index.ts";
import { router } from "./utils/router/router.tsx";

import "./App.css";
import { ThemeProvider } from "./context/ThemeContext.tsx";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
