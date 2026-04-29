import type { ContractRequest } from "@/entities/request";
import { api } from "@/shared";

export const createContractRequestApi = {
  create: (data: ContractRequest) =>
    api.post("/subsystem/contracts/request", data),
};
