import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { appRoutes } from "../config/routesConfig";

const Router = () => {
  const { auth } = useAuth();

  const router = createBrowserRouter(
    auth.isAuthenticated && auth.user.type === "admin"
      ? appRoutes.PROTECTED
      : appRoutes.GUEST
  );

  return <RouterProvider router={router} />;
};

export { Router };
