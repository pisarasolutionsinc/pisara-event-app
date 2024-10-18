import { RouteObject } from "react-router-dom";
import LoginPage from "../../pages/auth/Login";
import RegistrationPage from "../../pages/register/RegistrationPage";
import { IDPage } from "../../pages/id/IDPage";
import { ScannerLayout } from "../../layouts/ScannerLayout";
import { CertificateLayout } from "../../layouts/CertificateLayout";
import WelcomePage from "../../pages/welcome/Welcome";
import { CertificatePage } from "../../pages/certificate/certificatePage";
import WarningPage from "../pages/error/WarningPage";
import { EventPage } from "../pages/protected/event/EventPage";
import { CreateEventForm } from "../pages/protected/event/features/CreateEventForm";
import { CounterLayout } from "../layouts/CouterLayout";
import { AttendancePage } from "../pages/protected/attendance/AttendancePage";
import { AttendanceLayout } from "../layouts/AttendanceLayout";
import { HomePage } from "../pages/protected/home/HomePage";
import { PersonPage } from "../pages/protected/person/PersonPage";
import { AttendanceImport } from "../pages/protected/attendance/features/AttendanceImport";
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
          path: "/apps/event/",
          element: <HomePage />,
        },
        {
          path: "/:projectKey/event/",
          element: <EventPage />,
        },

        {
          path: "/:projectKey/event/create",
          element: <CreateEventForm />,
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
      element: <AttendanceLayout />,
      children: [
        {
          path: "/:projectKey/event/:itemId",
          element: <AttendancePage />,
        },
        {
          path: "/:projectKey/event/:itemId/import",
          element: <AttendanceImport />,
        },
        {
          path: "/:projectKey/event/:itemId/person",
          element: <PersonPage />,
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
