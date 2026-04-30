import { api } from "@/shared";
import type {
  ApproveContractRequestReq,
  ApproveContractRequestRes,
  ContractRequestInfo,
  RejectContractRequestReq,
  RejectContractRequestRes,
} from "@/entities/request";

export const adminContractRequestReviewApi = {
  getById: (requestId: number) =>
    api.get<ContractRequestInfo>(`/subsystem/contracts/request/${requestId}`),

  approve: (requestId: number, data: ApproveContractRequestReq) =>
    api.post<ApproveContractRequestRes>(
      `/subsystem/contracts/request/${requestId}/approve`,
      data,
    ),

  reject: (requestId: number, data: RejectContractRequestReq) =>
    api.post<RejectContractRequestRes>(
      `/subsystem/contracts/request/${requestId}/reject`,
      data,
    ),
};
