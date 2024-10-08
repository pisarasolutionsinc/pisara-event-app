import { RiHome2Line } from "react-icons/ri";

import { FaUser } from "react-icons/fa";
import { AppConfig } from "./../model/appConfigModels";

import { MdEvent } from "react-icons/md";

import { BiMap } from "react-icons/bi";

export const app = {
  host: {
    local: "http://localhost:5000/api",
    test: "http://localhost:3000",
    production: "http://localhost:3000",
  },

  control: {
    useTesting: false,
  },
};

export const TEMPLATE = {
  CERTIFICATE: {
    APPRECIATION: {
      HEADER: "Appreciation",
      BODY: "Thank you for sharing your valuable expertise on Food Safety during the Kadiwa ng Pangulo Training",
    },
    ATTENDANCE: {
      HEADER: "Attendance",
      BODY: "Thank you for your attendance. Your presence is greatly appreciated.",
    },
  },
};

export const navigation = {
  main: [
    {
      key: "home",
      name: "Home",
      type: "link",
      path: "/",
      icon: <RiHome2Line size={20} />,
    },
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
  counter: [
    {
      key: "events",
      name: "Events",
      type: "link",
      path: "/",
      icon: <MdEvent size={20} />,
    },
    {
      key: "welcome",
      name: "",
      type: "link",
      path: "/voters",
      icon: <FaUser size={20} />,
    },
  ],
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

// export const CLOUDINARY = {
//   CLOUD_NAME: "oro-dev" || process.env.CLOUD_NAME,
//   UPLOAD_PRESET_UNASIGNED: "oro-dev" || process.env.UPLOAD_PRESET_UNASIGNED,
//   DEFAULT_FOLDER: "oro-app/" || process.env.DEFAULT_FOLDER,
//   API_KEY: "295771128257341" || process.env.API_KEY,
//   API_SECRET: "1lJO-0IaT8ICTnVIPb41I9GoWdM" || process.env.API_SECRET,
//   IMAGE_UPLOAD_ENDPOINT:
//     "https://api.cloudinary.com/v1_1/oro-dev/image/upload" ||
//     process.env.IMAGE_UPLOAD_ENDPOINT,
//   IMAGE_DESTROY_ENDPOINT:
//     "https://api.cloudinary.com/v1_1/oro-dev/image/destroy" ||
//     process.env.IMAGE_DESTROY_ENDPOINT,
// };

export const CLOUDINARY = {
  CLOUD_NAME: "trifectasi" || process.env.CLOUD_NAME,
  UPLOAD_PRESET_UNASIGNED: "kadiwa" || process.env.UPLOAD_PRESET_UNASIGNED,
  DEFAULT_FOLDER: "kadiwa/" || process.env.DEFAULT_FOLDER,
  API_KEY: "787379199984857" || process.env.API_KEY,
  API_SECRET: "mM9CVVrVkqX1Dm9RDmVEc2XK81E" || process.env.API_SECRET,
  IMAGE_UPLOAD_ENDPOINT:
    "https://api.cloudinary.com/v1_1/trifectasi/image/upload" ||
    process.env.IMAGE_UPLOAD_ENDPOINT,
  IMAGE_DESTROY_ENDPOINT:
    "https://api.cloudinary.com/v1_1/trifectasi/image/destroy" ||
    process.env.IMAGE_DESTROY_ENDPOINT,
};
// Ensure URLType includes the values used in the URL object
type URLType = "LOCAL" | "TEST" | "PRODUCTION";

export const URL = {
  USE: "TEST" as URLType, // Correct type assertion
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
