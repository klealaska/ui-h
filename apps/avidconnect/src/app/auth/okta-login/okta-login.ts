export declare class OktaSignInWidget implements OktaSignInWidget {
  constructor(configuration: OktaSignInConfig);

  session: {
    get: (callback: (repsonse: any) => void) => void;
  };
  renderEl(configuration: { el: string }): void;
  showSignInAndRedirect(): void;
  remove(): void;
}

export interface OktaSignInConfig {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  authParams: OktaSignInConfigAuthParams;
  el?: string;
  logo?: string;
  i18n?: OktaSignInConfigi18n;
  customButtons?: OktaSignInCustomButtons[];
  helpLinks?: OktaSignInHelpLinks;
  features?: OktaSignInFeatureFlags;
}

interface OktaSignInConfigAuthParams {
  pkce?: boolean;
  responseMode?: OktaSignInConfigAuthParamsResponseMode;
  issuer?: string;
  display?: 'page';
  scopes?: string[];
  responseType?: string[];
}

interface OktaSignInConfigi18n {
  en?: {
    'primaryauth.username.placeholder'?: string;
    'primaryauth.username.tooltip'?: string;
    'primaryauth.title'?: string;
    'error.username.required'?: string;
    'error.password.required'?: string;
  };
}

interface OktaSignInCustomButtons {
  title?: string;
  className?: string;
  click?(): void;
}

interface OktaSignInHelpLinks {
  help?: string;
  forgotPassword?: string;
  unlock?: string;
  custom?: OktaSignInCustomHelpLink[];
}

interface OktaSignInCustomHelpLink {
  text: string;
  href: string;
}

interface OktaSignInFeatureFlags {
  router?: boolean;
  rememberMe?: boolean;
  autoPush?: boolean;
  smsRecovery?: boolean;
  callRecovery?: boolean;
  webauthn?: boolean;
  selfServiceUnlock?: boolean;
  multiOptionalFactorEnroll?: boolean;
  hideSignOutLinkInMFA?: boolean;
  registration?: boolean;
  idpDiscovery?: boolean;
  showPasswordToggleOnSignInPage?: boolean;
  scrollOnError?: boolean;
  skipIdpFactorVerificationBtn?: boolean;
}

type OktaSignInConfigAuthParamsResponseMode =
  | 'okta_post_message'
  | 'fragment'
  | 'query'
  | 'form_post';
