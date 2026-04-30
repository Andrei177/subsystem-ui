import { api } from "@/shared";
import type {
  AdminContractRequestShort,
  PageResponse,
} from "@/entities/request";

export const adminContractRequestsListApi = {
  getAll: (page: number, limit: number) =>
    api.get<PageResponse<AdminContractRequestShort>>(
      "/subsystem/contracts/requests",
      {
        params: {
          page,
          limit,
        },
      },
    ),
};
