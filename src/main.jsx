import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import router from "./Route";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <AuthProvider> */}
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} />
    {/* </AuthProvider> */}
  </React.StrictMode>
);
