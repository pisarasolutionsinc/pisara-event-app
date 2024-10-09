import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import ToastProvider from "./context/ToastProvider";
import { Router } from "./app/router/Router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <Router />
    </ToastProvider>
  </React.StrictMode>
);
