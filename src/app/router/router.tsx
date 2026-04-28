import { createBrowserRouter } from "react-router";

import { ProtectedRoute } from "./ProtectedRoute";

import { SignIn } from "@/pages/signin";
import { SignUp } from "@/pages/signup";
import { ContractRequestCreate } from "@/pages/contract-request-create";
import { ContractRequestInfo } from "@/pages/contract-request-info";
import { AdminRequests } from "@/pages/admin-requests";
import { Routes } from "@/shared";

export const router = createBrowserRouter([
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
        element: <ContractRequestInfo />,
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
