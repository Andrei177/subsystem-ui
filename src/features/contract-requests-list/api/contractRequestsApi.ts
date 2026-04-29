import type { ContractRequestShort } from "@/entities/request";
import { api } from "@/shared";

export const contractRequestsApi = {
  getMyRequests: () =>
    api.get<ContractRequestShort[]>("/subsystem/contracts/requests/my"),
};
