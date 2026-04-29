import { createBrowserRouter, Navigate } from "react-router";

import { ProtectedRoute } from "./ProtectedRoute";

import { SignIn } from "@/pages/signin";
import { SignUp } from "@/pages/signup";
import { ContractRequestCreate } from "@/pages/contract-request-create";
import { ContractRequestsInfo } from "@/pages/contract-requests-info";
import { AdminRequests } from "@/pages/admin-requests";
import { Routes } from "@/shared";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={Routes.CONTRACT_REQUEST} />,
  },
  {
    path: Routes.SIGNIN,
    element: <SignIn />,
  },
  {
    path: Routes.SIGNUP,
    element: <SignUp />,
  },
  {
    element: <ProtectedRoute allowedRoles={["USER", "ADMIN", "SUPER_ADMIN"]} />,
    children: [
      {
        path: Routes.CONTRACT_REQUEST_CREATE,
        element: <ContractRequestCreate />,
      },
      {
        path: Routes.CONTRACT_REQUEST,
        element: <ContractRequestsInfo />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute
        allowedRoles={["ADMIN", "SUPER_ADMIN"]}
        forbiddenRedirectTo={Routes.CONTRACT_REQUEST}
      />
    ),
    children: [
      {
        path: Routes.ADMIN_REQUESTS,
        element: <AdminRequests />,
      },
    ],
  },
]);
