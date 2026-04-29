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
