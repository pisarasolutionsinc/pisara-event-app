import { RouteObject } from "react-router-dom";

import WarningPage from "../pages/error/WarningPage";
import { EventPage } from "../pages/protected/event/EventPage";
import { CreateEventForm } from "../pages/protected/event/features/CreateEventForm";
import { CounterLayout } from "../layouts/CouterLayout";
import { AttendancePage } from "../pages/protected/attendance/AttendancePage";
import { AttendanceLayout } from "../layouts/AttendanceLayout";
import { HomePage } from "../pages/protected/home/HomePage";
import { PersonPage } from "../pages/protected/person/PersonPage";
import { AttendanceImport } from "../pages/protected/attendance/features/AttendanceImport";
import LoginPage from "../pages/guest/LoginPage";
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
  ] as RouteObject[],
};

export const appRoutes = routes;
