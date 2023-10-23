export interface UserProfile {
  businessPhones: string[]; //?
  displayName: string; //preferred_username
  givenName: string; //given_name
  id: string; //sub?
  jobTitle: string; //?
  mail: string; //email
  mobilePhone: string; //?
  officeLocation: string; //locale
  preferredLanguage: string;
  surname: string; //lastname
  userPrincipalName: string; //name or email?
}

/* 
//This is from the shared project

export interface UserAccount {
  sub: string;  //id?
  name: string;
  email: string;
  preferred_username: string;
  auth_time: number;  //?
  given_name: string; // firstname
  family_name: string; // lastname
  locale: string;
  zoneinfo: string;  //?
  updated_at: number;  //?
  email_verified: boolean;  //?
}
 */
