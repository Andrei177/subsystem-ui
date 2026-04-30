export type ContractRequest = {
  appUrl: string;
  appName: string;
  appDescription: string;
  contactEmail: string;

  integrationGoals: string;
  desiredOperations: string[];

  redirectUri: string;

  privacyPolicyUrl: string;

  additionalNotes: string;
};

export type ContractRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ContractRequestShort = {
  contractRequestId: number;
  appName: string;
  status: ContractRequestStatus;
  createdAt: string;
  reviewedAt: string | null;
};

export type ContractEndpoint = {
  path: string;
  method: string;
  operationGroup: string;
  requiresAuth: boolean;

  securityRequirements: unknown;
  requestContentType: string | null;
  requestParameters: unknown;
  requestBodySchema: unknown;
  responses: unknown;
};

export type Contract = {
  contractId: number;
  status: string;
  apiKey: string;
  rateLimitValue: number;
  rateLimitPeriod: string;
  clientId: string;
  clientSecret: string | null;
  redirectUri: string;
  endpoints: ContractEndpoint[];
  createdAt: string;
};

export type ContractRequestInfo = {
  requestId: number;
  status: ContractRequestStatus;
  appUrl: string;
  appName: string;
  appDescription: string;
  contactEmail: string;
  integrationGoals: string;
  desiredOperations: string[];
  approvedOperationGroups: string[] | null;
  redirectUri: string;
  privacyPolicyUrl: string;
  additionalNotes: string | null;
  rejectReason: string | null;
  createdAt: string;
  reviewedAt: string | null;
  contract: Contract | null;
};

export type PageResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminContractRequestShort = {
  requestId: number;
  status: ContractRequestStatus;
  appName: string;
  appUrl: string;
  contactEmail: string;
  createdAt: string;
  reviewedAt: string | null;
};

export type RateLimitPeriod =
  | "SECOND"
  | "MINUTE"
  | "HOUR"
  | "DAY"
  | "WEEK"
  | "MONTH";

export type ApproveContractRequestReq = {
  approvedOperationGroups: string[];
  rateLimitValue: number;
  rateLimitPeriod: RateLimitPeriod;
};

export type ApproveContractRequestRes = {
  contractId: number;
  message: string;
};

export type RejectContractRequestReq = {
  rejectReason: string;
};

export type RejectContractRequestRes = {
  message: string;
};
