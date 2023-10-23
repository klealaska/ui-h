export interface UserAccount {
  sub: string;
  name: string;
  email: string;
  preferred_username: string;
  auth_time: number;
  given_name: string; // firstname
  family_name: string; // lastname
  locale: string;
  zoneinfo: string;
  updated_at: number;
  email_verified: boolean;
}
