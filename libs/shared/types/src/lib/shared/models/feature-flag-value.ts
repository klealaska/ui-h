export interface FeatureFlagValue {
  id: string;
  description: string;
  enabled: boolean;
  conditions: FeatureFlagCondition;
}

export interface FeatureFlagGroups {
  Name: string;
  RolloutPercentage: number;
}

export interface FeatureFlagCondition {
  client_filters: {
    name: string;
    parameters?: FeatureFlagParameters;
  }[];
}

export interface FeatureFlagParameters {
  Audience?: {
    Users: string[];
    Groups: FeatureFlagGroups[];
  };
  Start?: string;
  End?: string;
  OrganizationIds?: number[];
}
