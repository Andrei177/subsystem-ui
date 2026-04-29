import { create } from "zustand";
import type { ContractRequest } from "./types";

const initialContractRequest: ContractRequest = {
  appUrl: "",
  appName: "",
  appDescription: "",
  contactEmail: "",

  integrationGoals: "",
  desiredOperations: [],

  redirectUri: "",

  privacyPolicyUrl: "",

  additionalNotes: "",
};

type ContractRequestStore = {
  contractRequest: ContractRequest;

  setField: <K extends keyof ContractRequest>(
    field: K,
    value: ContractRequest[K],
  ) => void;

  toggleDesiredOperation: (operation: string) => void;

  resetContractRequest: () => void;
};

export const useContractRequestStore = create<ContractRequestStore>((set) => ({
  contractRequest: initialContractRequest,

  setField: (field, value) =>
    set((state) => ({
      contractRequest: {
        ...state.contractRequest,
        [field]: value,
      },
    })),

  toggleDesiredOperation: (operation) =>
    set((state) => {
      const alreadySelected =
        state.contractRequest.desiredOperations.includes(operation);

      return {
        contractRequest: {
          ...state.contractRequest,
          desiredOperations: alreadySelected
            ? state.contractRequest.desiredOperations.filter(
                (item) => item !== operation,
              )
            : [...state.contractRequest.desiredOperations, operation],
        },
      };
    }),

  resetContractRequest: () =>
    set({
      contractRequest: initialContractRequest,
    }),
}));
