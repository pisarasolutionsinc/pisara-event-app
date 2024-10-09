import { RouteObject } from "react-router-dom";
import LoginPage from "../../pages/auth/Login";
import RegistrationPage from "../../pages/register/RegistrationPage";
import { IDPage } from "../../pages/id/IDPage";
import { CounterLayout } from "../../layouts/CouterLayout";
import EventPage from "../../pages/event/Events";
import { ScannerLayout } from "../../layouts/ScannerLayout";
import { CertificateLayout } from "../../layouts/CertificateLayout";
import WelcomePage from "../../pages/welcome/Welcome";
import { CertificatePage } from "../../pages/certificate/certificatePage";
import WarningPage from "../pages/error/WarningPage";
const routes = {
  GUEST: [
    {
      path: "*",
      element: <WarningPage />,
    },
    {
      path: "/:projectKey/event/",
      element: <LoginPage />,
    },
    {
      path: "/:projectKey/event/login",
      element: <LoginPage />,
    },
    {
      path: "/event/:id/:template/register",
      element: <RegistrationPage />,
    },
    {
      path: "/user/:id",
      element: <IDPage />,
    },
    {
      path: "/event/:eventId/user/:id",
      element: <IDPage />,
    },
  ],
  PROTECTED: [
    {
      element: <CounterLayout />,
      children: [
        {
          path: "/",
          element: <EventPage />,
        },
        {
          path: "/events",
          element: <EventPage />,
        },
        {
          children: [{ path: "/event/:id", element: <ScannerLayout /> }],
        },

        {
          path: "*",
          element: <EventPage />,
        },
      ],
    },
    {
      element: <CertificateLayout />,
      children: [
        {
          path: "/user/:id",
          element: <IDPage />,
        },
        {
          path: "/event/:eventId/user/:id",
          element: <IDPage />,
        },
        {
          path: "/event/:eventId/user/:id/certificate",
          element: <CertificatePage />,
        },
      ],
    },
    {
      path: "/event/:id/welcome",
      element: <WelcomePage />,
    },
    {
      path: "/event/:id/register",
      element: <RegistrationPage />,
    },
  ] as RouteObject[],
};

export const appRoutes = routes;
