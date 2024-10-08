import { RouteObject } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { ScannerLayout } from "../layouts/ScannerLayout";
import LoginPage from "../pages/auth/Login";
import { Encoding } from "../pages/Encoding";
import EventPage from "../pages/event/Events";
import SurveyForm from "../pages/Form";
import SurveyFormEditPage from "../pages/form/Edit";
import MapPage from "../pages/map/Map";
import ComingSoon from "../pages/others/ComingSoon";
import CloudinaryUploadPage from "../pages/test/cloudinaryUploadPage";
import InfiniteScroll from "../pages/test/InifitineScrolling";
import VotersPage from "../pages/voters/Voters";
import { FormLayout } from "../layouts/FormLayout";
import { PublicFormLayout } from "../layouts/PublicFormLayout";
import { CounterLayout } from "../layouts/CouterLayout";
import WelcomePage from "../pages/welcome/Welcome";
import RegistrationPage from "../pages/register/RegistrationPage";
import { IDPage } from "../pages/id/IDPage";
import { CertificatePage } from "../pages/certificate/certificatePage";
import { CertificateLayout } from "../layouts/CertificateLayout";

const routes = {
  guest: [
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "*",
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
  level_0: [
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <ComingSoon /> },
        { path: "/home", element: <ComingSoon /> },
        { path: "/encoding", element: <Encoding /> },
        { path: "/survey", element: <ComingSoon /> },
        { path: "/voters", element: <VotersPage /> },
        { path: "/attendance", element: <SurveyForm /> },
        { path: "/events", element: <EventPage /> },
        { path: "/election", element: <ComingSoon /> },
        { path: "/map", element: <MapPage /> },
        { path: "/test/infinitescroll", element: <InfiniteScroll /> },
      ],
    },
    {
      children: [{ path: "/event/:id", element: <ScannerLayout /> }],
    },
    {
      element: <FormLayout />,
      children: [
        { path: "/survey/:id/edit", element: <SurveyFormEditPage /> },
        { path: "/survey/:id", element: <SurveyForm /> },
      ],
    },
    {
      element: <PublicFormLayout />,
      children: [
        { path: "/survey/:id/view", element: <SurveyForm /> },
        { path: "/test/upload", element: <CloudinaryUploadPage /> },
      ],
    },
    {
      path: "/event/:id/:accessLevel",
      element: <EventPage />,
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
    {
      path: "/event/:id/:template/welcome",
      element: <WelcomePage />,
    },
    {
      path: "/event/:eventId/user/:id/certificate",
      element: <CertificatePage />,
    },
  ],
  level_1: [
    {
      path: "/",
      element: <LoginPage />,
    },
  ],
  level_4: [
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
  ],
  level_5: [
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
  ] as RouteObject[],
};

// Cast the routes object to the desired type
export const appRoutes = routes;
