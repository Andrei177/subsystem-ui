import type { ContractRequestInfo } from "@/entities/request";
import { api } from "@/shared";

export const contractRequestInfoApi = {
  getById: (requestId: number) =>
    api.get<ContractRequestInfo>(`/subsystem/contracts/request/${requestId}`),
};
