import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Router } from "./router/Router";
import ToastProvider from "./context/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <Router />
    </ToastProvider>
  </React.StrictMode>
);
