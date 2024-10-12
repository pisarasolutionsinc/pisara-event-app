import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { appRoutes } from "../config/routesConfig";

const Router = () => {
  const { isAuthenticated } = useAuth();

  const router = createBrowserRouter(
    isAuthenticated ? appRoutes.PROTECTED : appRoutes.GUEST
  );

  return <RouterProvider router={router} />;
};

export { Router };
