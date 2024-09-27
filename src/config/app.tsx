import { RouteObject } from "react-router-dom";
// import { Home } from "../pages/Home";
// import { Dashboard } from "../pages/Dashboard";
import { RiHome2Line } from "react-icons/ri";
import { MainLayout } from "../layouts/MainLayout";
import { Encoding } from "../pages/Encoding";
// import { BsDatabaseAdd } from "react-icons/bs";
// import { FcSurvey } from "react-icons/fc";
// import Survey from "../pages/Survey";
import SurveyForm from "../pages/Form";
import { FaUser } from "react-icons/fa";
import { AppConfig } from "./../model/appConfigModels";
import SurveyFormEditPage from "../pages/form/Edit";
import { FormLayout } from "../layouts/FormLayout";
import VotersPage from "../pages/voters/Voters";
import { MdEvent } from "react-icons/md";
import EventPage from "../pages/event/Events";
import { PublicFormLayout } from "../layouts/PublicFormLayout";
// import ElectionDashboard from "../pages/election/ElectionPage";
import { BiMap } from "react-icons/bi";

import CloudinaryUploadPage from "../pages/test/cloudinaryUploadPage";
import LoginPage from "../pages/auth/Login";
import MapPage from "../pages/map/Map";
import TestPage from "../pages/test/test";
import { ScannerLayout } from "../layouts/ScannerLayout";
import ComingSoon from "../pages/others/ComingSoon";
import InfiniteScroll from "../pages/test/InifitineScrolling";

export const app = {
  routes: {
    guest: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "*",
        element: <LoginPage />,
      },
    ],
    protected: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <ComingSoon />,
          },
          {
            path: "/home",
            element: <ComingSoon />,
          },
          {
            path: "/encoding",
            element: <Encoding />,
          },
          {
            path: "/survey",
            element: <ComingSoon />,
          },
          {
            path: "/voters",
            element: <VotersPage />,
          },
          {
            path: "/attendance",
            element: <SurveyForm />,
          },
          {
            path: "/events",
            element: <EventPage />,
          },

          {
            path: "/election",
            element: <ComingSoon />,
          },
          {
            path: "/map",
            element: <MapPage />,
          },
          {
            path: "/test",
            element: <TestPage />,
          },
          {
            path: "/test/infinitescroll",
            element: <InfiniteScroll />,
          },
        ],
      },
      {
        children: [
          {
            path: "/event/:id",
            element: <ScannerLayout />,
          },
        ],
      },
      {
        element: <FormLayout />,
        children: [
          {
            path: "/survey/:id/edit",
            element: <SurveyFormEditPage />,
          },
          {
            path: "/survey/:id",
            element: <SurveyForm />,
          },
        ],
      },
      {
        element: <PublicFormLayout />,
        children: [
          {
            path: "/survey/:id/view",
            element: <SurveyForm />,
          },
          {
            path: "/test/upload",
            element: <CloudinaryUploadPage />,
          },
        ],
      },
    ] as RouteObject[],
  },

  navigation: [
    {
      key: "home",
      name: "Home",
      type: "link",
      path: "/",
      icon: <RiHome2Line size={20} />,
    },
    // {
    //   key: "election",
    //   name: "Election",
    //   type: "link",
    //   path: "/election",
    //   icon: <BsDatabaseAdd size={20} />,
    // },
    // {
    //   key: "survey",
    //   name: "Survey",
    //   type: "link",
    //   path: "/survey",
    //   icon: <FcSurvey size={20} />,
    // },
    {
      key: "voters",
      name: "Voters",
      type: "link",
      path: "/voters",
      icon: <FaUser size={20} />,
    },
    {
      key: "events",
      name: "Events",
      type: "link",
      path: "/events",
      icon: <MdEvent size={20} />,
    },
    {
      key: "map",
      name: "Map",
      type: "link",
      path: "/map",
      icon: <BiMap size={20} />,
    },
  ],

  host: {
    local: "http://localhost:5000/api",
    test: "http://localhost:3000",
    production: "http://localhost:3000",
  },

  control: {
    useTesting: false,
  },
};

export const ui: AppConfig = {
  class: {
    use: "custom_1",
    table: {
      main: {
        custom_1: "",
      },
      header: {
        custom_1: "text-gray-400 text-xs font-semibold tracking-wider",
      },
      trh: {
        custom_1: "border-t",
      },
      th: {
        custom_1: "p-2 ",
      },
      body: {
        custom_1: "text-gray-900",
      },
      trb: {
        custom_1: " text-gray-600",
      },
      td: {
        custom_1: "text-xs px-2 ",
      },
      item_hover: {
        custom_1: "bg-gray-200",
      },
    },
  },
};

export const CLOUDINARY = {
  CLOUD_NAME: "oro-dev" || process.env.CLOUD_NAME,
  UPLOAD_PRESET_UNASIGNED: "oro-dev" || process.env.UPLOAD_PRESET_UNASIGNED,
  DEFAULT_FOLDER: "oro-app/" || process.env.DEFAULT_FOLDER,
  API_KEY: "295771128257341" || process.env.API_KEY,
  API_SECRET: "1lJO-0IaT8ICTnVIPb41I9GoWdM" || process.env.API_SECRET,
  IMAGE_UPLOAD_ENDPOINT:
    "https://api.cloudinary.com/v1_1/oro-dev/image/upload" ||
    process.env.IMAGE_UPLOAD_ENDPOINT,
  IMAGE_DESTROY_ENDPOINT:
    "https://api.cloudinary.com/v1_1/oro-dev/image/destroy" ||
    process.env.IMAGE_DESTROY_ENDPOINT,
};
// Ensure URLType includes the values used in the URL object
type URLType = "LOCAL" | "TEST" | "PRODUCTION";

export const URL = {
  USE: "LOCAL" as URLType, // Correct type assertion
  APP: {
    LOCAL: "http://localhost:5173",
  },
  API: {
    LOCAL: "http://localhost:5000",
    TEST: "https://opo-api-dev-b2e1021665b2.herokuapp.com",
    PRODUCTION: "http://localhost:3000",
  },
};

export const ENDPOINTS = {
  BASE: "/api/",
  GET_ALL: "/get/all",
  GET_BY_ID: "/get/:id",
  CREATE: "/create",
  UPDATE: "/update",
  DELETE: "/delete/:id",
  SEARCH: "/search",
  LOGIN: "/login",
  LOGOUT: "/logout",
  CHECKLOGIN: "/current/user",
};

// Use URL.USE to dynamically select the API base URL
export const API = {
  BASE_URL: URL.API[URL.USE], // Ensure this access is valid
};

// export const SOCKET = "http://localhost:5000";
export const SOCKET = "https://opo-api-dev-b2e1021665b2.herokuapp.com";
