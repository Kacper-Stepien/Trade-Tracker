import { RouterProvider } from "react-router-dom";
import "./utils/i18n/index.ts";
import { router } from "./utils/router/router.tsx";
import "./App.css";
import { useUserQuery } from "./hooks/useUserQuery.ts";
import AppLoader from "./components/AppLoader/AppLoader.tsx";

function App() {
  const { isLoading } = useUserQuery();

  if (isLoading) return <AppLoader />;

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
