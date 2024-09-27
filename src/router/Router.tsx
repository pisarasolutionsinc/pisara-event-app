import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { app } from "../config/app";
import { useAuth } from "../hooks/useAuth";

const Router = () => {
  const { auth } = useAuth();

  const router = createBrowserRouter(
    auth.isAuthenticated ? app.routes.protected : app.routes.guest
  );

  return <RouterProvider router={router} />;
};

export { Router };
