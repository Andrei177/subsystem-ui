import { createBrowserRouter, Navigate } from "react-router";

import { ProtectedRoute } from "./ProtectedRoute";

import { SignIn } from "@/pages/signin";
import { SignUp } from "@/pages/signup";
import { ContractRequestCreate } from "@/pages/contract-request-create";
import { ContractRequestsInfo } from "@/pages/contract-requests-info";
import { AdminRequests } from "@/pages/admin-requests";
import { Routes } from "@/shared";
import { ContractRequest } from "@/pages/contract-request";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={Routes.CONTRACT_REQUESTS} />,
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
        path: Routes.CONTRACT_REQUESTS,
        element: <ContractRequestsInfo />,
      },
      {
        path: Routes.CONTRACT_REQUESTS_ID,
        element: <ContractRequest />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute
        allowedRoles={["ADMIN", "SUPER_ADMIN"]}
        forbiddenRedirectTo={Routes.CONTRACT_REQUESTS}
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
