export interface Chameleon {
  id: string;
  email: string;

  // SUGGESTED - user properties:
  created?: Date;
  name: string;
  role?: string;
  roles?: string[];
  logins?: number;
  project?: string;

  // OPTIONAL - company properties:
  company?: {
    uid: string;
    created: Date;
    name: string;
    trial_ends: Date;
    version: string;
    plan: string;
    spend: string;
  };
}
