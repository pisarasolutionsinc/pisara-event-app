import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { appRoutes } from "../config/routes";

const Router = () => {
  const { auth } = useAuth();

  const router = createBrowserRouter(
    auth.isAuthenticated && auth.user.accessLevel === "0"
      ? appRoutes.level_0
      : auth.isAuthenticated && auth.user.accessLevel === "4"
      ? appRoutes.level_4
      : appRoutes.guest
  );

  return <RouterProvider router={router} />;
};

export { Router };
