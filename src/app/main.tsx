import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthInitializer } from "@/features/auth";
import { RouterProvider } from "react-router";
import { router } from "./router/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  </StrictMode>,
);
