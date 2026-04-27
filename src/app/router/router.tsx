import { createBrowserRouter } from "react-router";

import { ProtectedRoute } from "./ProtectedRoute";

import { SignIn } from "@/pages/signin";
import { SignUp } from "@/pages/signup";
import { ContractRequestCreate } from "@/pages/contract-request-create";
import { ContractRequestInfo } from "@/pages/contract-request-info";
import { AdminRequests } from "@/pages/admin-requests";

export const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    element: (
      <ProtectedRoute
        allowedRoles={["REPRESENTATIVE", "ADMIN", "SUPER_ADMIN"]}
      />
    ),
    children: [
      {
        path: "/contracts/request/create",
        element: <ContractRequestCreate />,
      },
      {
        path: "/contracts/request",
        element: <ContractRequestInfo />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute
        allowedRoles={["ADMIN", "SUPER_ADMIN"]}
        forbiddenRedirectTo="/contracts/request"
      />
    ),
    children: [
      {
        path: "/admin/requests",
        element: <AdminRequests />,
      },
    ],
  },
]);
