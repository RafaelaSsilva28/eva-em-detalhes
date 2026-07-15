import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />

      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 3500,

          style: {
            background: "#fff8f5",
            color: "#4a2632",
            border: "1px solid rgba(140, 45, 78, 0.16)",
            borderRadius: "18px",
            padding: "14px 18px",
            boxShadow: "0 14px 40px rgba(117, 41, 68, 0.16)",
            fontSize: "14px",
            fontWeight: "600"
          },

          success: {
            iconTheme: {
              primary: "#7f8c3a",
              secondary: "#fff8f5"
            }
          },

          error: {
            iconTheme: {
              primary: "#b8325a",
              secondary: "#fff8f5"
            }
          }
        }}
      />
    </BrowserRouter>
  </StrictMode>
);