import type { ContractRequestInfo } from "@/entities/request";
import { api } from "@/shared";
import type { ContractReceivedRes } from "./apiTypes";

export const contractRequestInfoApi = {
  getById: (requestId: number) =>
    api.get<ContractRequestInfo>(`/subsystem/contracts/request/${requestId}`),
  markContractReceived: (contractId: number) => {
    return api.post<ContractReceivedRes>(
      `/subsystem/contracts/${contractId}/received`,
    );
  },
};
