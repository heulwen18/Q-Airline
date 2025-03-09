import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "./context/AuthContext";
import { DarkModeContextProvider } from "./context/darkModeContext";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <DarkModeContextProvider>
        <App />
        <ToastContainer position="top-center" autoClose={3000} />
      </DarkModeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
